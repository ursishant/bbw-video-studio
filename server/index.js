const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { scrapeArticle } = require('./scraper');
const { generateSpeechWithTimestamps } = require('./tts');
const { fetchBRollForKeyword } = require('./broll');
const { parseScriptToStoryboard } = require('./scriptParser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));
app.use('/broll', express.static(path.join(__dirname, '../public/broll')));
app.use('/outputs', express.static(path.join(__dirname, '../public/outputs')));
app.use(express.static(path.join(__dirname, '../public/studio')));

// List of available free open-source neural voices
const VOICES_CATALOG = [
  { id: "en-US-RyanMultilingualNeural", name: "Ryan", desc: "British BBC-Style News Anchor (Formal & Crisp)", gender: "Male", category: "Featured / Preferred", sampleUrl: "/audio/samples/en-US-RyanMultilingualNeural.mp3" },
  { id: "en-US-EricNeural", name: "Eric", desc: "High-Energy Business Presenter (Punchy & Fast)", gender: "Male", category: "Featured / Preferred", sampleUrl: "/audio/samples/en-US-EricNeural.mp3" },
  { id: "en-US-GuyNeural", name: "Guy", desc: "American News Anchor (High-Energy & Viral)", gender: "Male", category: "News / Viral", sampleUrl: "/audio/samples/en-US-GuyNeural.mp3" },
  { id: "en-US-ChristopherNeural", name: "Christopher", desc: "Authoritative Broadcaster (Deep & Formal)", gender: "Male", category: "News / Viral", sampleUrl: "/audio/samples/en-US-ChristopherNeural.mp3" },
  { id: "en-US-AndrewNeural", name: "Andrew", desc: "Modern Tech & Finance Host (Clear & Confident)", gender: "Male", category: "Modern & Tech", sampleUrl: "/audio/samples/en-US-AndrewNeural.mp3" },
  { id: "en-US-BrianNeural", name: "Brian", desc: "Deep Documentary Narration (Serious & Crisp)", gender: "Male", category: "Documentary", sampleUrl: "/audio/samples/en-US-BrianNeural.mp3" },
  { id: "en-US-RogerNeural", name: "Roger", desc: "Wall Street Market Analyst (Mature & Serious)", gender: "Male", category: "Finance", sampleUrl: "/audio/samples/en-US-RogerNeural.mp3" },
  { id: "en-US-SteffanNeural", name: "Steffan", desc: "Dynamic Storyteller (Conversational)", gender: "Male", category: "Storytelling", sampleUrl: "/audio/samples/en-US-SteffanNeural.mp3" },
  { id: "en-US-AriaNeural", name: "Aria", desc: "Breaking News Female Host (Crisp & Engaging)", gender: "Female", category: "Female Hosts", sampleUrl: "/audio/samples/en-US-AriaNeural.mp3" },
  { id: "en-US-AvaNeural", name: "Ava", desc: "Modern Expressive Presenter (Warm & Natural)", gender: "Female", category: "Female Hosts", sampleUrl: "/audio/samples/en-US-AvaNeural.mp3" },
  { id: "en-US-JennyNeural", name: "Jenny", desc: "Clear News Reporter (Friendly & Professional)", gender: "Female", category: "Female Hosts", sampleUrl: "/audio/samples/en-US-JennyNeural.mp3" },
  { id: "en-US-EmmaNeural", name: "Emma", desc: "Business & Tech Reporter (Confident & Direct)", gender: "Female", category: "Female Hosts", sampleUrl: "/audio/samples/en-US-EmmaNeural.mp3" },
  { id: "en-IN-PrabhatNeural", name: "Prabhat", desc: "Indian English News Presenter (Clear & Authoritative)", gender: "Male", category: "Indian English", sampleUrl: "/audio/samples/en-IN-PrabhatNeural.mp3" },
  { id: "en-IN-NeerjaNeural", name: "Neerja", desc: "Indian English Expressive Presenter (Polished)", gender: "Female", category: "Indian English", sampleUrl: "/audio/samples/en-IN-NeerjaNeural.mp3" }
];

// 0. Get Voices Catalog
app.get('/api/voices', (req, res) => {
  res.json({ success: true, voices: VOICES_CATALOG });
});

// 1. Scrape Article URL or Auto-Extract Script
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'URL or text script is required' });
    }

    const trimmed = url.trim();
    // If user pasted script text instead of an HTTP URL, automatically parse as script
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      console.log(`[Smart Input] Text detected in URL field (${trimmed.length} chars), routing to script parser...`);
      const storyboardData = await parseScriptToStoryboard(trimmed);
      return res.json({ success: true, data: storyboardData });
    }

    console.log(`[Scraper] Scraping URL: ${trimmed}`);
    const articleData = await scrapeArticle(trimmed);
    res.json({ success: true, data: articleData });
  } catch (error) {
    console.error('[Scraper Error]', error);
    res.status(500).json({ error: error.message || 'Failed to scrape article' });
  }
});

// 1.5. Parse Custom Script into 3D Storyboard & Find Image
app.post('/api/parse-script', async (req, res) => {
  try {
    const { scriptText, title } = req.body;
    if (!scriptText || !scriptText.trim()) {
      return res.status(400).json({ error: 'Script text is required' });
    }

    console.log(`[Script Parser] Extracting storyboard from script (${scriptText.length} chars)...`);
    const storyboardData = await parseScriptToStoryboard(scriptText, title || '');
    res.json({ success: true, data: storyboardData });
  } catch (error) {
    console.error('[Script Parser Error]', error);
    res.status(500).json({ error: error.message || 'Failed to parse script' });
  }
});

// 2. Search & Fetch B-Roll
app.post('/api/broll', async (req, res) => {
  try {
    const { keyword } = req.body;
    const brollClip = await fetchBRollForKeyword(keyword || 'finance');
    res.json({ success: true, clip: brollClip });
  } catch (error) {
    console.error('[B-Roll Error]', error);
    res.status(500).json({ error: error.message || 'Failed to fetch B-roll' });
  }
});

// 3. Generate Voiceover Audio & Word Timestamps (Edge-TTS)
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text, voice = 'en-US-RyanMultilingualNeural', rate = '+10%' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audioFilename = `narration_${Date.now()}.mp3`;
    const outputPath = path.join(__dirname, '../public/audio', audioFilename);

    console.log(`[TTS] Generating voiceover (${voice}, ${rate}) for: "${text.substring(0, 60)}..."`);
    const ttsResult = await generateSpeechWithTimestamps(text, outputPath, voice, rate);

    res.json({
      success: true,
      audioUrl: `audio/${audioFilename}`,
      durationInSeconds: ttsResult.durationInSeconds,
      words: ttsResult.words
    });
  } catch (error) {
    console.error('[TTS Error]', error);
    res.status(500).json({ error: error.message || 'Failed to generate voiceover' });
  }
});

// 4. Render Video to MP4 using Remotion (Shorts or Long-Form)
app.post('/api/render-video', async (req, res) => {
  try {
    const { videoProps, compositionId = 'BigBreakingWireVideo' } = req.body;
    if (!videoProps) {
      return res.status(400).json({ error: 'videoProps is required' });
    }

    const isLong = compositionId === 'BigBreakingWireLongVideo';
    const filename = `bbw_${isLong ? 'long' : 'short'}_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../public/outputs', filename);
    const tempPropsPath = path.join(__dirname, `../public/audio/props_${Date.now()}.json`);

    fs.writeFileSync(tempPropsPath, JSON.stringify(videoProps, null, 2));

    const renderCommand = `npx remotion render src/index.ts ${compositionId} "${outputPath}" --props="${tempPropsPath}" --public-dir="public" --concurrency=2 --overwrite`;
    console.log(`[Render] Starting Remotion render for: ${filename} (Composition: ${compositionId})`);

    exec(renderCommand, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      // Clean up temp props file
      try { fs.unlinkSync(tempPropsPath); } catch (e) {}

      if (error) {
        console.error('[Render Error]', error, stderr);
        return res.status(500).json({ error: error.message || 'Render failed', stderr });
      }

      console.log(`[Render Complete] Video rendered to: ${filename}`);
      res.json({
        success: true,
        filename,
        videoUrl: `/outputs/${filename}`
      });
    });
  } catch (error) {
    console.error('[Server Error]', error);
    res.status(500).json({ error: error.message || 'Server error during render' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 BigBreakingWire Video Studio running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`====================================================`);
});
