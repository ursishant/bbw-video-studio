const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { generateSpeechWithTimestamps } = require('./server/tts');

async function renderRBIShort() {
  console.log('=== 1. Setting Up RBI MPC Minutes Storyboard ===');
  const title = "RBI MPC Minutes: Repo Rate Held at 5.25% as Inflation Risks Persist";
  const category = "Economy";
  const domain = "bigbreakingwire.in";
  const imageUrl = "https://i0.wp.com/bigbreakingwire.in/wp-content/uploads/2026/08/pexels-photo-35190583-3.jpeg?fit=867%2C1300&ssl=1";

  const twitterCard = {
    accountName: "BigBreakingWire",
    handle: "@BigBreakingWire",
    verified: true,
    text: "RBI MPC unanimously holds policy repo rate at 5.25%.\n\nFY27 GDP growth projected at strong 6.7%.\n\nInflation target pegged at 5% amid persistent food price risks.",
    bulletPoints: [
      "RBI MPC unanimously holds policy repo rate at 5.25%.",
      "FY27 GDP growth projected at strong 6.7%.",
      "Inflation target pegged at 5% amid persistent food price risks."
    ],
    highlightPhrase: "repo rate at 5.25%"
  };

  const articleSections = [
    {
      heading: "⚡ Unanimous Rate Decision",
      content: "The RBI Monetary Policy Committee unanimously retained the benchmark repo rate at 5.25%, continuing with its neutral monetary stance.",
      highlight: "retained the benchmark repo rate at 5.25%"
    },
    {
      heading: "📊 Growth & Inflation Outlook",
      content: "Real GDP growth is projected at 6.7% for FY27, while CPI inflation is expected to average 5.0% due to persistent supply shocks.",
      highlight: "GDP growth is projected at 6.7%"
    },
    {
      heading: "📌 Policy Vigilance",
      content: "Governor Das highlighted the necessity of remaining watchful on food price volatility to ensure headline inflation aligns with the 4% target.",
      highlight: "aligns with the 4% target"
    }
  ];

  const fullNarration = "The Reserve Bank of India just released crucial MPC minutes, holding repo rates at 5.25%! Growth forecasts remain strong at 6.7% for FY27, while inflation is pegged at 5%. The Monetary Policy Committee maintained a neutral stance, prioritizing price stability. Follow BigBreakingWire for daily breaking market updates.";

  console.log('=== 2. Generating Voiceover with Eric (High-Energy & Viral) ===');
  const audioPath = path.join(__dirname, 'public/audio/rbi_narration_eric.mp3');
  const ttsRes = await generateSpeechWithTimestamps(fullNarration, audioPath, 'en-US-EricNeural', '+12%');
  console.log(`Generated audio: ${ttsRes.durationInSeconds}s, ${ttsRes.words.length} words`);

  console.log('=== 3. Composing 3D Video Schema Props ===');
  const videoProps = {
    title,
    hookHeadline: "RBI MPC Minutes: Repo Rate Held at 5.25%",
    domain,
    imageUrl,
    category,
    twitterCard,
    articleSections,
    takeaways: twitterCard.bulletPoints,
    outro: {
      headline: "Big Breaking Wire",
      tagline: "NEWS. FAST. FIRST.",
      subtext: "Like • Share • Subscribe"
    },
    durationInSeconds: ttsRes.durationInSeconds,
    words: ttsRes.words,
    audioUrl: `audio/${path.basename(audioPath)}`,
    bgMusicUrl: "assets/news_beat.wav"
  };

  const propsPath = path.join(__dirname, 'public/audio/rbi_3d_props.json');
  fs.writeFileSync(propsPath, JSON.stringify(videoProps, null, 2));

  console.log('=== 4. Rendering Full 1080x1920 3D Short Video ===');
  const outputPath = path.join(__dirname, 'public/outputs/rbi_mpc_eric_short.mp4');
  const cmd = `npx remotion render src/index.ts BigBreakingWireVideo "${outputPath}" --props="${propsPath}" --public-dir="public" --concurrency=2 --overwrite`;
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });

  console.log(`\n🎉 RBI 3D SHORT RENDERED SUCCESSFULLY WITH ERIC VOICE!\nFile: ${outputPath}`);
}

renderRBIShort().catch(console.error);
