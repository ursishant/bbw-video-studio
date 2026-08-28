const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Generate speech and word-level timestamps using edge-tts
 * @param {string} text Full script to voice
 * @param {string} outputAudioPath Destination .mp3 path
 * @param {string} voice Voice model name (e.g. en-US-ChristopherNeural, en-US-GuyNeural, en-US-AndrewNeural, en-GB-RyanNeural)
 * @param {string} rate Speech rate modifier, e.g. "+5%", "+10%"
 * @returns {Promise<{ durationInSeconds: number, words: Array<{word: string, start: number, end: number}>, vtt: string }>}
 */
async function generateSpeechWithTimestamps(text, outputAudioPath, voice = 'en-US-EricNeural', rate = '+10%') {
  const outputDir = path.dirname(outputAudioPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Voice aliases
  let safeVoice = voice;
  if (voice === 'en-US-RyanMultilingualNeural' || voice === 'RyanMultilingual' || voice === 'Ryan') {
    safeVoice = 'en-GB-RyanNeural';
  }

  const tempScriptPath = outputAudioPath.replace(/\.mp3$/, '_script.txt');

  // Sanitize script text for clean reading
  const cleanText = text
    .replace(/#/g, '')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  fs.writeFileSync(tempScriptPath, cleanText, 'utf-8');

  // Python script to call edge_tts with sentence & word timestamp alignment
  const pythonScript = `
import asyncio
import edge_tts
import json
import sys

async def main():
    voice = "${safeVoice}"
    rate = "${rate}"
    with open("${tempScriptPath}", "r", encoding="utf-8") as f:
        text = f.read()

    communicate = edge_tts.Communicate(text, voice, rate=rate)
    
    words = []
    
    with open("${outputAudioPath}", "wb") as file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                file.write(chunk["data"])
            elif chunk["type"] == "SentenceBoundary":
                sentence_start = chunk["offset"] / 10_000_000.0
                sentence_dur = chunk["duration"] / 10_000_000.0
                sentence_words = chunk["text"].split()
                if not sentence_words:
                    continue
                total_chars = max(1, sum(len(w) for w in sentence_words))
                cur_time = sentence_start
                for w in sentence_words:
                    w_dur = max(0.12, (len(w) / total_chars) * sentence_dur)
                    words.append({
                        "word": w,
                        "start": round(cur_time, 2),
                        "end": round(cur_time + w_dur, 2)
                    })
                    cur_time += w_dur

    with open("${outputAudioPath.replace(/\.mp3$/, '_words.json')}", "w", encoding="utf-8") as jf:
        json.dump(words, jf)

asyncio.run(main())
`;

  const pyTempPath = outputAudioPath.replace(/\.mp3$/, '_gen.py');
  fs.writeFileSync(pyTempPath, pythonScript, 'utf-8');

  return new Promise((resolve, reject) => {
    exec(`python3 "${pyTempPath}"`, async (error, stdout, stderr) => {
      // Clean up py temp script
      try { if (fs.existsSync(pyTempPath)) fs.unlinkSync(pyTempPath); } catch (e) {}
      try { if (fs.existsSync(tempScriptPath)) fs.unlinkSync(tempScriptPath); } catch (e) {}

      if (error) {
        console.error('Edge-TTS error:', stderr || error.message);
        return reject(new Error(`Failed to generate speech: ${stderr || error.message}`));
      }

      // Read generated words JSON
      const wordsJsonPath = outputAudioPath.replace(/\.mp3$/, '_words.json');
      let words = [];
      if (fs.existsSync(wordsJsonPath)) {
        try {
          words = JSON.parse(fs.readFileSync(wordsJsonPath, 'utf-8'));
        } catch (e) {
          console.error('Error parsing words json:', e);
        }
      }

      // Calculate audio duration via ffprobe
      exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputAudioPath}"`, (ffErr, ffOut) => {
        let duration = 30;
        if (!ffErr && ffOut.trim()) {
          duration = parseFloat(ffOut.trim()) || 30;
        } else if (words.length > 0) {
          duration = words[words.length - 1].end + 0.5;
        }

        resolve({
          durationInSeconds: duration,
          words,
          audioUrl: `/audio/${path.basename(outputAudioPath)}`
        });
      });
    });
  });
}

module.exports = {
  generateSpeechWithTimestamps
};
