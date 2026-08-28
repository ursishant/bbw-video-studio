const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { generateSpeechWithTimestamps } = require('./server/tts');

async function renderChartDemo() {
  console.log('=== 1. Composing Video with 3D Animated Comparison Chart ===');
  const title = "NVIDIA Q2 FY2027: Revenue Surges 106% to $96.2 Billion";
  const category = "Business";
  const domain = "bigbreakingwire.in";
  const imageUrl = "https://i0.wp.com/bigbreakingwire.in/wp-content/uploads/2026/08/DH1L4415-HDR-20220527-r5.jpg?fit=2560%2C1707&ssl=1";

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
    type: "bar-comparison",
    title: "NVIDIA Revenue (YoY Surge)",
    subtitle: "in Billions USD",
    metricUnit: "B",
    prevLabel: "Q2 FY2026",
    prevValue: 46.7,
    prevFormatted: "$46.7B",
    currLabel: "Q2 FY2027",
    currValue: 96.2,
    currFormatted: "$96.2B",
    changeBadge: "+106% YoY SURGE",
    isPositive: true
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

  const fullNarration = "Nvidia just shattered Wall Street with a massive 96.2 billion dollar quarter! Comparing year over year, revenue more than doubled from 46.7 billion to 96.2 billion, surging 106 percent! Driven by an insane 89 billion dollar Data Center demand, net income reached nearly 60 billion. Follow BigBreakingWire for daily market breakdowns.";

  console.log('=== 2. Generating High-Energy Voiceover with Eric ===');
  const audioPath = path.join(__dirname, 'public/audio/nvidia_chart_eric.mp3');
  const ttsRes = await generateSpeechWithTimestamps(fullNarration, audioPath, 'en-US-EricNeural', '+14%');
  console.log(`Generated audio: ${ttsRes.durationInSeconds}s, ${ttsRes.words.length} words`);

  console.log('=== 3. Composing 3D Video Schema Props ===');
  const videoProps = {
    title,
    hookHeadline: "NVIDIA Revenue Surges 106% to $96.2 Billion",
    domain,
    imageUrl,
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

  const propsPath = path.join(__dirname, 'public/audio/nvidia_chart_props.json');
  fs.writeFileSync(propsPath, JSON.stringify(videoProps, null, 2));

  console.log('=== 4. Rendering Full 1080x1920 3D Short Video with Animated Chart ===');
  const outputPath = path.join(__dirname, 'public/outputs/nvidia_3d_chart_short.mp4');
  const cmd = `npx remotion render src/index.ts BigBreakingWireVideo "${outputPath}" --props="${propsPath}" --public-dir="public" --concurrency=2 --overwrite`;
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });

  console.log(`\n🎉 3D SHORT WITH ANIMATED CHART RENDERED SUCCESSFULLY!\nFile: ${outputPath}`);
}

renderChartDemo().catch(console.error);
