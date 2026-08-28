const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { generateSpeechWithTimestamps } = require('./server/tts');
const { fetchBRollForKeyword } = require('./server/broll');

async function renderRyanShort() {
  console.log('=== 1. Setting Up 9:16 Short with Ryan Voice & B-Roll ===');
  const title = "NVIDIA Q2 FY2027: Revenue Surges 106% to $96.2 Billion";
  const category = "Business";
  const domain = "bigbreakingwire.in";

  // Fetch B-roll for hero
  const brollHero = await fetchBRollForKeyword('nvidia ai');

  const twitterCard = {
    accountName: "BigBreakingWire",
    handle: "@BigBreakingWire",
    verified: true,
    text: "NVIDIA Q2 FY2027 revenue reached $96.2 billion (+106% YoY).\n\nData Center revenue exploded 117% YoY to $89.0 billion.\n\nNet income skyrocketed 126% to $59.69 billion ($2.46 EPS).",
    bulletPoints: [
      "NVIDIA Q2 FY2027 revenue reached $96.2 billion (+106% YoY).",
      "Data Center revenue exploded 117% YoY to $89.0 billion.",
      "Net income skyrocketed 126% to $59.69 billion ($2.46 EPS)."
    ],
    highlightPhrase: "revenue reached $96.2 billion"
  };

  const chartData = {
    enabled: true,
    type: "combo-trend",
    title: "NVIDIA Revenue Trajectory (YoY Growth)",
    subtitle: "Quarterly Revenue in Billions USD",
    prevLabel: "Q2 FY2026",
    prevValue: 46.7,
    prevFormatted: "$46.7B",
    currLabel: "Q2 FY2027",
    currValue: 96.2,
    currFormatted: "$96.2B",
    changeBadge: "+106% YoY SURGE",
    isPositive: true,
    datapoints: [
      { label: 'Q1 FY26', value: 26.0, formatted: '$26.0B' },
      { label: 'Q2 FY26', value: 46.7, formatted: '$46.7B' },
      { label: 'Q3 FY26', value: 35.1, formatted: '$35.1B' },
      { label: 'Q4 FY26', value: 60.9, formatted: '$60.9B' },
      { label: 'Q1 FY27', value: 72.5, formatted: '$72.5B' },
      { label: 'Q2 FY27', value: 96.2, formatted: '$96.2B', isPeak: true },
    ]
  };

  const articleSections = [
    {
      heading: "⚡ Record Breaking Growth",
      content: "NVIDIA Q2 FY2027 revenue reached $96.2 billion, up 106% year-on-year and 18% from the previous quarter.",
      highlight: "reached $96.2 billion, up 106%"
    },
    {
      heading: "📊 Data Center & Net Income",
      content: "Data Center revenue rose 117% year-on-year to $89.0 billion. Net income skyrocketed 126% to $59.69 billion.",
      highlight: "Data Center revenue rose 117%"
    }
  ];

  const fullNarration = "Nvidia has officially delivered one of the most explosive quarters in history, shattering Wall Street with 96.2 billion dollars in revenue! Revenue surged 106 percent year over year, fueled by an unstoppable 89 billion dollar Data Center demand. Follow BigBreakingWire for daily financial breakdowns.";

  console.log('=== 2. Generating Voiceover with Ryan (Preferred Voice) ===');
  const audioPath = path.join(__dirname, 'public/audio/nvidia_ryan_short.mp3');
  const ttsRes = await generateSpeechWithTimestamps(fullNarration, audioPath, 'en-US-RyanMultilingualNeural', '+10%');
  console.log(`Generated audio: ${ttsRes.durationInSeconds}s, ${ttsRes.words.length} words`);

  console.log('=== 3. Composing 9:16 Video Schema Props ===');
  const videoProps = {
    title,
    hookHeadline: "NVIDIA Revenue Surges 106% to $96.2 Billion",
    domain,
    imageUrl: brollHero.url,
    category,
    twitterCard,
    chartData,
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

  const propsPath = path.join(__dirname, 'public/audio/nvidia_ryan_short_props.json');
  fs.writeFileSync(propsPath, JSON.stringify(videoProps, null, 2));

  console.log('=== 4. Rendering Full 1080x1920 9:16 Short Video ===');
  const outputPath = path.join(__dirname, 'public/outputs/nvidia_ryan_916_short.mp4');
  const cmd = `npx remotion render src/index.ts BigBreakingWireVideo "${outputPath}" --props="${propsPath}" --public-dir="public" --concurrency=2 --overwrite`;
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });

  console.log(`\n🎉 9:16 SHORT WITH RYAN VOICE RENDERED SUCCESSFULLY!\nFile: ${outputPath}`);
}

renderRyanShort().catch(console.error);
