const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { scrapeArticle } = require('./server/scraper');
const { generateSpeechWithTimestamps } = require('./server/tts');

async function renderNvidiaShort() {
  console.log('=== 1. Scraping NVIDIA Article & Generating Fast-Paced Script ===');
  const url = "https://bigbreakingwire.in/nvidia-q2-fy2027-revenue-96-2-billion/";
  const data = await scrapeArticle(url);
  console.log(`Title: ${data.title}`);
  console.log(`Image: ${data.imageUrl}`);
  console.log(`Fast-Paced Script: "${data.fullNarration}"`);

  console.log('=== 2. Generating High-Energy Neural Voiceover ===');
  const audioPath = path.join(__dirname, 'public/audio/nvidia_narration_fast.mp3');
  // High-energy news anchor voice at +10% speed
  const ttsRes = await generateSpeechWithTimestamps(data.fullNarration, audioPath, 'en-US-ChristopherNeural', '+10%');
  console.log(`Generated audio: ${ttsRes.durationInSeconds}s, ${ttsRes.words.length} words`);

  console.log('=== 3. Composing 3D Video Schema Props ===');
  const videoProps = {
    title: data.title,
    hookHeadline: data.hookHeadline,
    domain: "bigbreakingwire.in",
    imageUrl: data.imageUrl,
    category: data.category || "Business",
    twitterCard: data.twitterCard,
    articleSections: data.articleSections,
    takeaways: data.takeaways,
    outro: data.outro,
    durationInSeconds: ttsRes.durationInSeconds,
    words: ttsRes.words,
    audioUrl: `audio/${path.basename(audioPath)}`,
    bgMusicUrl: "assets/news_beat.wav"
  };

  const propsPath = path.join(__dirname, 'public/audio/nvidia_3d_props.json');
  fs.writeFileSync(propsPath, JSON.stringify(videoProps, null, 2));

  console.log('=== 4. Rendering Full 1080x1920 3D Short Video ===');
  const outputPath = path.join(__dirname, 'public/outputs/nvidia_3d_viral_short.mp4');
  const cmd = `npx remotion render src/index.ts BigBreakingWireVideo "${outputPath}" --props="${propsPath}" --concurrency=2 --overwrite`;
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });

  console.log(`\n🎉 FAST-PACED 3D SHORT RENDERED SUCCESSFULLY!\nFile: ${outputPath}`);
}

renderNvidiaShort().catch(console.error);
