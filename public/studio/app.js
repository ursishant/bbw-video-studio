// BigBreakingWire Shorts Video Studio Frontend Logic

let currentVideoData = {
  title: "NVIDIA Q2 FY2027: Revenue Surges 106% to $96.2 Billion",
  hookHeadline: "Nvidia just shattered Wall Street with a massive 96.2 billion dollar quarter!",
  domain: "bigbreakingwire.in",
  category: "Business",
  imageUrl: "https://i0.wp.com/bigbreakingwire.in/wp-content/uploads/2026/08/DH1L4415-HDR-20220527-r5.jpg?fit=2560%2C1707&ssl=1",
  twitterCard: {
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
  },
  articleSections: [
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
  ],
  chartData: {
    enabled: true,
    type: "combo-trend",
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
  },
  fullNarration: "Nvidia has officially delivered one of the most explosive quarters in corporate history, reporting a staggering 96.2 billion dollars in revenue. Driven by an unstoppable 89 billion dollar Data Center demand, net income reached nearly 60 billion. Follow BigBreakingWire for daily in-depth market intelligence.",
  outro: {
    headline: "Big Breaking Wire",
    tagline: "NEWS. FAST. FIRST.",
    subtext: "Subscribe for Daily Financial Intelligence"
  },
  durationInSeconds: 22,
  words: [],
  audioUrl: ""
};

// Preset samples
const samplePresets = {
  'sample-nvidia': {
    title: "NVIDIA Q2 FY2027: Revenue Surges 106% to $96.2 Billion",
    imageUrl: "https://i0.wp.com/bigbreakingwire.in/wp-content/uploads/2026/08/DH1L4415-HDR-20220527-r5.jpg?fit=2560%2C1707&ssl=1",
    domain: "bigbreakingwire.in",
    category: "Business",
    bulletPoints: [
      "NVIDIA Q2 FY2027 revenue reached $96.2 billion (+106% YoY).",
      "Data Center revenue exploded 117% YoY to $89.0 billion.",
      "Net income skyrocketed 126% to $59.69 billion ($2.46 EPS)."
    ],
    sections: [
      {
        heading: "⚡ Record Breaking Growth",
        content: "Data Center demand surged 117% to $89.0 billion. Net income skyrocketed 126% to nearly $60 billion with next quarter guidance projected at $108 billion."
      }
    ],
    chartData: {
      enabled: true,
      type: "combo-trend",
      title: "NVIDIA Revenue (YoY Surge)",
      subtitle: "in Billions USD",
      prevLabel: "Q2 FY2026",
      prevValue: 46.7,
      prevFormatted: "$46.7B",
      currLabel: "Q2 FY2027",
      currValue: 96.2,
      currFormatted: "$96.2B",
      changeBadge: "+106% YoY SURGE",
      isPositive: true
    },
    narration: "Nvidia has officially delivered one of the most explosive quarters in corporate history, reporting a staggering 96.2 billion dollars in revenue. Driven by an unstoppable 89 billion dollar Data Center demand, net income reached nearly 60 billion. Follow BigBreakingWire for daily in-depth market intelligence."
  },
  'sample-rbi': {
    title: "RBI MPC Minutes: Repo Rate Held at 5.25% as Inflation Risks Persist",
    imageUrl: "https://i0.wp.com/bigbreakingwire.in/wp-content/uploads/2026/08/pexels-photo-35190583-3.jpeg?fit=867%2C1300&ssl=1",
    domain: "bigbreakingwire.in",
    category: "Economy",
    bulletPoints: [
      "RBI MPC unanimously holds policy repo rate at 5.25%.",
      "FY27 GDP growth projected at strong 6.7%.",
      "Inflation target pegged at 5% amid persistent food price risks."
    ],
    sections: [
      {
        heading: "⚡ Unanimous Rate Decision",
        content: "The RBI Monetary Policy Committee unanimously retained the benchmark repo rate at 5.25%, continuing with its neutral monetary stance."
      },
      {
        heading: "📊 Growth & Inflation Outlook",
        content: "Real GDP growth is projected at 6.7% for FY27, while CPI inflation is expected to average 5.0% due to persistent supply shocks."
      }
    ],
    chartData: {
      enabled: true,
      type: "area-spline",
      title: "India Growth vs Inflation (FY27)",
      subtitle: "RBI MPC Projections",
      prevLabel: "CPI Inflation",
      prevValue: 5.0,
      prevFormatted: "5.0%",
      currLabel: "Real GDP Growth",
      currValue: 6.7,
      currFormatted: "6.7%",
      changeBadge: "+6.7% GDP TARGET",
      isPositive: true
    },
    narration: "The Reserve Bank of India just released crucial MPC minutes, holding repo rates at 5.25%! Growth forecasts remain strong at 6.7% for FY27, while inflation is pegged at 5%. Follow BigBreakingWire for daily market breakdowns."
  },
  'sample-buffett': {
    title: "Warren Buffett's Berkshire Hathaway Now Holds More T-Bills Than the Fed",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1080&q=80",
    domain: "bigbreakingwire.in",
    category: "Finance",
    bulletPoints: [
      "Warren Buffett holds $300.87B in U.S. Treasury bills.",
      "Accounts for 4.89% of the entire $6.15 Trillion market.",
      "Surpasses the $195 Billion held by the U.S. Federal Reserve."
    ],
    sections: [
      {
        heading: "📌 Record T-Bill Holdings",
        content: "Buffett now owns 1 out of every 20 dollars circulating in short-term government debt, surpassing the entire Federal Reserve balance."
      }
    ],
    chartData: {
      enabled: true,
      type: "combo-trend",
      title: "US Treasury Holdings (Billions USD)",
      subtitle: "Buffett vs Federal Reserve",
      prevLabel: "Federal Reserve",
      prevValue: 195.0,
      prevFormatted: "$195B",
      currLabel: "Warren Buffett",
      currValue: 300.9,
      currFormatted: "$300.9B",
      changeBadge: "+54% OVER THE FED",
      isPositive: true
    },
    narration: "Warren Buffett just did something unprecedented in the US Treasury market! Berkshire Hathaway quietly amassed 300 billion dollars in T-bills, surpassing the entire Federal Reserve balance. Follow BigBreakingWire for daily market breakdowns."
  },
  'sample-trumpxi': {
    title: "Trump–Xi Historic Summit: Tariffs Slashed & Rare Earth Deal Sealed!",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1080&q=80",
    domain: "bigbreakingwire.in",
    category: "World",
    bulletPoints: [
      "President Trump called high-stakes Xi meeting a 12 out of 10.",
      "U.S. Tariffs on Chinese imports slashed from 57% to 47%.",
      "China resumes immediate massive U.S. soybean purchases."
    ],
    sections: [
      {
        heading: "⚡ Trade Reset & Tariffs",
        content: "Trump confirmed tariffs will drop to 47% while fentanyl tariffs are cut to 10% and rare earth material supplies are fully restored."
      }
    ],
    chartData: {
      enabled: true,
      type: "combo-trend",
      title: "US Tariffs on Chinese Imports",
      subtitle: "Historic Tariff Reduction",
      prevLabel: "Previous Tariff",
      prevValue: 57.0,
      prevFormatted: "57%",
      currLabel: "New Tariff Deal",
      currValue: 47.0,
      currFormatted: "47%",
      changeBadge: "-10% TARIFF CUT",
      isPositive: true
    },
    narration: "Major breaking news on the global trade front! President Trump and Xi Jinping reached a breakthrough deal, cutting Chinese import tariffs to 47 percent and restoring rare earth supply. Follow BigBreakingWire for breaking updates."
  }
};

// DOM Elements
const quickProduceBtn = document.getElementById('quickProduceBtn');
const quickProduceSpinner = document.getElementById('quickProduceSpinner');

const modeTabUrl = document.getElementById('modeTabUrl');
const modeTabScript = document.getElementById('modeTabScript');
const modeUrlWrap = document.getElementById('modeUrlWrap');
const modeScriptWrap = document.getElementById('modeScriptWrap');

const urlInput = document.getElementById('articleUrlInput');
const scrapeBtn = document.getElementById('scrapeBtn');
const scrapeSpinner = document.getElementById('scrapeSpinner');

const customScriptInput = document.getElementById('customScriptInput');
const parseScriptBtn = document.getElementById('parseScriptBtn');
const parseScriptSpinner = document.getElementById('parseScriptSpinner');
const syncFromNarrationBtn = document.getElementById('syncFromNarrationBtn');

const videoTitleInput = document.getElementById('videoTitle');
const heroImageInput = document.getElementById('heroImage');
const imagePreview = document.getElementById('imagePreview');
const bullet1Input = document.getElementById('bulletPoint1');
const bullet2Input = document.getElementById('bulletPoint2');
const bullet3Input = document.getElementById('bulletPoint3');
const scenesContainer = document.getElementById('scenesContainer');
const addSceneBtn = document.getElementById('addSceneBtn');

// Chart Elements
const enableChartToggle = document.getElementById('enableChartToggle');
const chartInputsWrap = document.getElementById('chartInputsWrap');
const chartTypeSelect = document.getElementById('chartTypeSelect');
const chartTitleInput = document.getElementById('chartTitle');
const chartPrevLabelInput = document.getElementById('chartPrevLabel');
const chartPrevValInput = document.getElementById('chartPrevVal');
const chartPrevFmtInput = document.getElementById('chartPrevFmt');
const chartCurrLabelInput = document.getElementById('chartCurrLabel');
const chartCurrValInput = document.getElementById('chartCurrVal');
const chartCurrFmtInput = document.getElementById('chartCurrFmt');
const chartBadgeInput = document.getElementById('chartBadge');
const chartSubtitleInput = document.getElementById('chartSubtitle');

// Voice & Atmosphere
const voiceSelect = document.getElementById('voiceSelect');
const speechRateSelect = document.getElementById('speechRate');
const bgMusicSelect = document.getElementById('bgMusicSelect');
const subColorSelect = document.getElementById('subColorSelect');
const auditionVoiceBtn = document.getElementById('auditionVoiceBtn');
const auditionIcon = document.getElementById('auditionIcon');
const auditionText = document.getElementById('auditionText');
const previewSampleAudio = document.getElementById('previewSampleAudio');

// Script & Live Gauge
const narrationScript = document.getElementById('narrationScript');
const polishScriptBtn = document.getElementById('polishScriptBtn');
const scriptWordCount = document.getElementById('scriptWordCount');
const scriptDurationEstimate = document.getElementById('scriptDurationEstimate');
const scriptRetentionBadge = document.getElementById('scriptRetentionBadge');

const generateAudioBtn = document.getElementById('generateAudioBtn');
const audioSpinner = document.getElementById('audioSpinner');
const audioPlayer = document.getElementById('audioPlayer');

// Render Actions
const renderMp4Btn = document.getElementById('renderMp4Btn');
const renderSpinner = document.getElementById('renderSpinner');
const renderStatusCard = document.getElementById('renderStatusCard');
const statusMessage = document.getElementById('statusMessage');
const downloadContainer = document.getElementById('downloadContainer');
const downloadVideoLink = document.getElementById('downloadVideoLink');
const replayVideoBtn = document.getElementById('replayVideoBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');

// Preview Elements
const mockupScreen = document.getElementById('mockupScreen');
const renderedVideoPlayer = document.getElementById('renderedVideoPlayer');
const prevHighlight1 = document.getElementById('prevHighlight1');
const prevPointsList = document.getElementById('prevPointsList');
const prevImg = document.getElementById('prevImg');
const prevDomain = document.getElementById('prevDomain');
const prevActiveSub = document.getElementById('prevActiveSub');

// Live Script Gauge Updater
function updateScriptGauge() {
  const text = narrationScript.value.trim();
  if (!text) {
    scriptWordCount.innerText = "📊 0 words";
    scriptDurationEstimate.innerText = "⏱️ 0s";
    scriptRetentionBadge.className = "badge-optimal";
    scriptRetentionBadge.innerText = "🟢 Ready";
    return;
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  scriptWordCount.innerText = `📊 ${wordCount} words`;

  // Speech pacing rate calculation (words per minute: base ~145 wpm)
  let rateMultiplier = 1.0;
  if (speechRateSelect.value === '+8%') rateMultiplier = 1.08;
  if (speechRateSelect.value === '+10%') rateMultiplier = 1.10;
  if (speechRateSelect.value === '+15%') rateMultiplier = 1.15;

  const wpm = 145 * rateMultiplier;
  const estimatedSeconds = Math.round((wordCount / wpm) * 60);
  scriptDurationEstimate.innerText = `⏱️ ~${estimatedSeconds} seconds`;

  if (estimatedSeconds <= 30) {
    scriptRetentionBadge.className = "badge-optimal";
    scriptRetentionBadge.innerText = "🟢 Optimal for Shorts (<30s)";
  } else if (estimatedSeconds <= 45) {
    scriptRetentionBadge.className = "badge-warning";
    scriptRetentionBadge.innerText = "🟡 Good Retention (30-45s)";
  } else {
    scriptRetentionBadge.className = "badge-danger";
    scriptRetentionBadge.innerText = "🔴 Long (>45s, trim if needed)";
  }
}

narrationScript.addEventListener('input', updateScriptGauge);
speechRateSelect.addEventListener('change', updateScriptGauge);

// Subtitle Color Selector Listener
subColorSelect.addEventListener('change', () => {
  if (prevActiveSub) {
    prevActiveSub.style.backgroundColor = subColorSelect.value;
  }
});

// Polish Script Button: Optimizes script for high retention
polishScriptBtn.addEventListener('click', () => {
  let text = narrationScript.value.trim();
  if (!text) return;

  // Add punchy hook if missing
  if (!text.includes('!') && !text.includes('shattered') && !text.includes('breaking')) {
    text = `${videoTitleInput.value.replace(/[:|]/g, '—')} is making massive headlines! ${text}`;
  }

  // Optimize pacing by shortening run-on sentences
  text = text.replace(/(\.|\?|!)\s+/g, '. ').replace(/\s+/g, ' ');
  if (!text.toLowerCase().includes('follow bigbreakingwire')) {
    text += ' Follow BigBreakingWire for daily breaking market updates.';
  }

  narrationScript.value = text.trim();
  updateScriptGauge();
});

// Render Dynamic Scenes
function renderScenesUI(sections) {
  scenesContainer.innerHTML = '';
  if (!sections || sections.length === 0) {
    sections = [{ heading: "⚡ Key Takeaway", content: "" }];
  }

  sections.forEach((sec, idx) => {
    const sceneDiv = document.createElement('div');
    sceneDiv.className = 'scene-card-item';
    sceneDiv.innerHTML = `
      <div class="scene-card-header">
        <span class="scene-title-badge">Scene ${idx + 2} (Article 3D View)</span>
        ${sections.length > 1 ? `<button type="button" class="remove-scene-btn" data-index="${idx}">✕ Remove</button>` : ''}
      </div>
      <input type="text" class="scene-heading-input" data-index="${idx}" placeholder="⚡ Section Heading" value="${sec.heading || ''}" />
      <textarea rows="3" class="scene-content-input" data-index="${idx}" placeholder="Supportive article content & key numbers...">${sec.content || ''}</textarea>
    `;
    scenesContainer.appendChild(sceneDiv);
  });

  document.querySelectorAll('.scene-heading-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const i = parseInt(e.target.getAttribute('data-index'));
      currentVideoData.articleSections[i].heading = e.target.value;
    });
  });

  document.querySelectorAll('.scene-content-input').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const i = parseInt(e.target.getAttribute('data-index'));
      currentVideoData.articleSections[i].content = e.target.value;
    });
  });

  document.querySelectorAll('.remove-scene-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(e.target.getAttribute('data-index'));
      currentVideoData.articleSections.splice(i, 1);
      renderScenesUI(currentVideoData.articleSections);
    });
  });
}

// Add New Scene Button
addSceneBtn.addEventListener('click', () => {
  if (!currentVideoData.articleSections) currentVideoData.articleSections = [];
  currentVideoData.articleSections.push({
    heading: `⚡ Key Point ${currentVideoData.articleSections.length + 1}`,
    content: ""
  });
  renderScenesUI(currentVideoData.articleSections);
});

// Chart Toggle
enableChartToggle.addEventListener('change', () => {
  if (enableChartToggle.checked) {
    chartInputsWrap.classList.remove('hidden');
    if (!currentVideoData.chartData) currentVideoData.chartData = {};
    currentVideoData.chartData.enabled = true;
  } else {
    chartInputsWrap.classList.add('hidden');
    if (currentVideoData.chartData) currentVideoData.chartData.enabled = false;
  }
});

// Initialize Form
function populateFormFromData(data) {
  videoTitleInput.value = data.title || "";
  heroImageInput.value = data.imageUrl || "";
  if (data.imageUrl) {
    imagePreview.src = data.imageUrl;
    imagePreview.classList.remove('hidden');
    prevImg.src = data.imageUrl;
  }
  
  if (data.twitterCard?.bulletPoints) {
    bullet1Input.value = data.twitterCard.bulletPoints[0] || "";
    bullet2Input.value = data.twitterCard.bulletPoints[1] || "";
    bullet3Input.value = data.twitterCard.bulletPoints[2] || "";
  }

  renderScenesUI(data.articleSections || []);

  if (data.chartData && data.chartData.enabled !== false) {
    enableChartToggle.checked = true;
    chartInputsWrap.classList.remove('hidden');
    chartTypeSelect.value = data.chartData.type || "combo-trend";
    chartTitleInput.value = data.chartData.title || "";
    chartPrevLabelInput.value = data.chartData.prevLabel || "";
    chartPrevValInput.value = data.chartData.prevValue || 0;
    chartPrevFmtInput.value = data.chartData.prevFormatted || "";
    chartCurrLabelInput.value = data.chartData.currLabel || "";
    chartCurrValInput.value = data.chartData.currValue || 0;
    chartCurrFmtInput.value = data.chartData.currFormatted || "";
    chartBadgeInput.value = data.chartData.changeBadge || "";
    chartSubtitleInput.value = data.chartData.subtitle || "";
  } else {
    enableChartToggle.checked = false;
    chartInputsWrap.classList.add('hidden');
  }

  narrationScript.value = data.fullNarration || "";
  prevDomain.innerText = data.domain || "bigbreakingwire.in";

  renderedVideoPlayer.classList.add('hidden');
  mockupScreen.classList.remove('hidden');

  updateLivePreview();
  updateScriptGauge();
}

function updateLivePreview() {
  prevHighlight1.innerText = bullet1Input.value || videoTitleInput.value || "Breaking News Update";
  prevPointsList.innerHTML = `
    <div style="margin-top: 6px; color: #475569;">• ${bullet2Input.value || ''}</div>
    ${bullet3Input.value ? `<div style="margin-top: 4px; color: #475569;">• ${bullet3Input.value}</div>` : ''}
  `;
}

// Event Listeners
[videoTitleInput, bullet1Input, bullet2Input, bullet3Input].forEach(el => {
  el?.addEventListener('input', () => {
    renderedVideoPlayer.classList.add('hidden');
    mockupScreen.classList.remove('hidden');
    updateLivePreview();
  });
});

heroImageInput.addEventListener('input', () => {
  const url = heroImageInput.value.trim();
  if (url) {
    imagePreview.src = url;
    imagePreview.classList.remove('hidden');
    prevImg.src = url;
  }
});

// Voice Audition Player
function playVoiceSample(voiceId) {
  const sampleUrl = `/audio/samples/${voiceId}.mp3`;
  previewSampleAudio.src = sampleUrl;
  previewSampleAudio.play().then(() => {
    auditionIcon.innerText = "⏸";
    auditionText.innerText = "Playing...";
  }).catch(e => {
    console.error("Audio playback error:", e);
  });
}

previewSampleAudio.addEventListener('ended', () => {
  auditionIcon.innerText = "▶";
  auditionText.innerText = "Audition";
});

auditionVoiceBtn.addEventListener('click', () => {
  if (!previewSampleAudio.paused) {
    previewSampleAudio.pause();
    previewSampleAudio.currentTime = 0;
    auditionIcon.innerText = "▶";
    auditionText.innerText = "Audition";
  } else {
    playVoiceSample(voiceSelect.value);
  }
});

voiceSelect.addEventListener('change', () => {
  currentVideoData.audioUrl = "";
  playVoiceSample(voiceSelect.value);
});

// Sample Preset Buttons
document.querySelectorAll('.sample-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-url');
    let preset = samplePresets[key];
    if (!preset && key.startsWith('http')) {
      urlInput.value = key;
      scrapeBtn.click();
      return;
    }
    if (!preset) return;

    currentVideoData.title = preset.title;
    currentVideoData.imageUrl = preset.imageUrl;
    currentVideoData.category = preset.category;
    currentVideoData.domain = preset.domain;
    currentVideoData.twitterCard = {
      accountName: "BigBreakingWire",
      handle: "@BigBreakingWire",
      verified: true,
      text: preset.bulletPoints.join('\n\n'),
      bulletPoints: preset.bulletPoints,
      highlightPhrase: preset.bulletPoints[0]
    };
    currentVideoData.articleSections = preset.sections || [];
    currentVideoData.chartData = preset.chartData || null;
    currentVideoData.fullNarration = preset.narration;
    currentVideoData.audioUrl = "";

    populateFormFromData(currentVideoData);
  });
});

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!res.ok) {
      throw new Error(`Server returned ${res.status} ${res.statusText}. Please make sure the local server (npm start) is running.`);
    }
    throw new Error('Received non-JSON response from server.');
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Server error (${res.status})`);
  }
  return data;
}

// Mode Switching Tabs
modeTabUrl?.addEventListener('click', () => {
  modeTabUrl.classList.add('active');
  modeTabScript.classList.remove('active');
  modeUrlWrap.classList.remove('hidden');
  modeScriptWrap.classList.add('hidden');
});

modeTabScript?.addEventListener('click', () => {
  modeTabScript.classList.add('active');
  modeTabUrl.classList.remove('active');
  modeScriptWrap.classList.remove('hidden');
  modeUrlWrap.classList.add('hidden');
});

// 1. Scrape URL
scrapeBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    alert('Please enter an article URL!');
    return;
  }

  scrapeSpinner.classList.remove('hidden');
  scrapeBtn.disabled = true;

  try {
    const result = await fetchJson('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (result.success && result.data) {
      currentVideoData = result.data;
      populateFormFromData(result.data);
    } else {
      alert(`Scraping failed: ${result.error || 'Unknown error'}`);
    }
  } catch (err) {
    alert(`Error scraping article: ${err.message}`);
  } finally {
    scrapeSpinner.classList.add('hidden');
    scrapeBtn.disabled = false;
  }
});

// 1.5. Extract Storyboard & Image from Custom Script
async function handleParseScript(scriptText, spinnerEl, btnEl) {
  if (!scriptText || !scriptText.trim()) {
    alert('Please enter or paste your script text first!');
    return;
  }

  if (spinnerEl) spinnerEl.classList.remove('hidden');
  if (btnEl) btnEl.disabled = true;

  try {
    const result = await fetchJson('/api/parse-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scriptText: scriptText.trim(),
        title: videoTitleInput.value.trim()
      })
    });

    if (result.success && result.data) {
      currentVideoData = result.data;
      populateFormFromData(result.data);
    } else {
      alert(`Script parsing failed: ${result.error || 'Unknown error'}`);
    }
  } catch (err) {
    alert(`Error parsing script: ${err.message}`);
  } finally {
    if (spinnerEl) spinnerEl.classList.add('hidden');
    if (btnEl) btnEl.disabled = false;
  }
}

parseScriptBtn?.addEventListener('click', () => {
  handleParseScript(customScriptInput.value, parseScriptSpinner, parseScriptBtn);
});

syncFromNarrationBtn?.addEventListener('click', () => {
  handleParseScript(narrationScript.value, null, syncFromNarrationBtn);
});

// 2. Generate Audio & Timestamps
generateAudioBtn.addEventListener('click', async () => {
  const text = narrationScript.value.trim();
  if (!text) {
    alert('Please enter narration text!');
    return;
  }

  audioSpinner.classList.remove('hidden');
  generateAudioBtn.disabled = true;

  try {
    const result = await fetchJson('/api/generate-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice: voiceSelect.value,
        rate: speechRateSelect.value
      })
    });

    if (result.success) {
      currentVideoData.audioUrl = result.audioUrl;
      currentVideoData.durationInSeconds = result.durationInSeconds;
      currentVideoData.words = result.words;
      currentVideoData.generatedText = text;
      currentVideoData.generatedVoice = voiceSelect.value;

      audioPlayer.src = result.audioUrl.startsWith('/') ? result.audioUrl : `/${result.audioUrl}`;
      audioPlayer.classList.remove('hidden');
      audioPlayer.play().catch(() => {});
    } else {
      alert(`Voice generation failed: ${result.error || 'Unknown error'}`);
    }
  } catch (err) {
    alert(`Error generating voiceover: ${err.message}`);
  } finally {
    audioSpinner.classList.add('hidden');
    generateAudioBtn.disabled = false;
  }
});

// Replay Video Preview Button
replayVideoBtn.addEventListener('click', () => {
  if (renderedVideoPlayer.src) {
    renderedVideoPlayer.currentTime = 0;
    renderedVideoPlayer.muted = false;
    renderedVideoPlayer.volume = 1.0;
    renderedVideoPlayer.play();
  }
});

// Copy Direct Video Link
copyLinkBtn.addEventListener('click', () => {
  if (downloadVideoLink.href) {
    navigator.clipboard.writeText(downloadVideoLink.href).then(() => {
      const oldText = copyLinkBtn.innerText;
      copyLinkBtn.innerText = "✅ Link Copied!";
      setTimeout(() => copyLinkBtn.innerText = oldText, 2000);
    });
  }
});

// 3. Render 1080x1920 MP4 Video
async function triggerRenderPipeline() {
  const text = narrationScript.value.trim();
  if (!text) {
    alert('Please enter narration script first!');
    return;
  }

  // Always generate fresh voiceover if none exists or script/voice was changed
  if (
    !currentVideoData.audioUrl ||
    currentVideoData.generatedText !== text ||
    currentVideoData.generatedVoice !== voiceSelect.value
  ) {
    statusMessage.innerText = `Generating voiceover with ${voiceSelect.value}...`;
    renderStatusCard.classList.remove('hidden');
    renderSpinner.classList.remove('hidden');
    renderMp4Btn.disabled = true;

    try {
      const voiceData = await fetchJson('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: voiceSelect.value,
          rate: speechRateSelect.value
        })
      });
      if (!voiceData.success) throw new Error(voiceData.error || 'Voice generation failed');
      currentVideoData.audioUrl = voiceData.audioUrl;
      currentVideoData.durationInSeconds = voiceData.durationInSeconds;
      currentVideoData.words = voiceData.words;
      currentVideoData.generatedText = text;
      currentVideoData.generatedVoice = voiceSelect.value;
    } catch (e) {
      statusMessage.innerText = `❌ Voice generation failed: ${e.message}`;
      renderSpinner.classList.add('hidden');
      renderMp4Btn.disabled = false;
      return;
    }
  }

  let chartPayload = null;
  if (enableChartToggle.checked && chartTitleInput.value) {
    chartPayload = {
      enabled: true,
      type: chartTypeSelect.value || "combo-trend",
      title: chartTitleInput.value,
      subtitle: chartSubtitleInput.value,
      prevLabel: chartPrevLabelInput.value,
      prevValue: parseFloat(chartPrevValInput.value) || 0,
      prevFormatted: chartPrevFmtInput.value,
      currLabel: chartCurrLabelInput.value,
      currValue: parseFloat(chartCurrValInput.value) || 0,
      currFormatted: chartCurrFmtInput.value,
      changeBadge: chartBadgeInput.value,
      isPositive: true
    };
  }

  const payloadProps = {
    title: videoTitleInput.value,
    hookHeadline: bullet1Input.value || videoTitleInput.value,
    domain: prevDomain.innerText || "bigbreakingwire.in",
    category: currentVideoData.category || "Business",
    imageUrl: heroImageInput.value || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1080&q=80",
    twitterCard: {
      accountName: "BigBreakingWire",
      handle: "@BigBreakingWire",
      verified: true,
      text: bullet1Input.value,
      bulletPoints: [bullet1Input.value, bullet2Input.value, bullet3Input.value].filter(Boolean),
      highlightPhrase: bullet1Input.value
    },
    chartData: chartPayload,
    articleSections: currentVideoData.articleSections && currentVideoData.articleSections.length > 0
      ? currentVideoData.articleSections
      : [
          {
            heading: "⚡ Key Takeaway",
            content: bullet1Input.value,
            highlight: bullet1Input.value
          }
        ],
    takeaways: [bullet1Input.value, bullet2Input.value, bullet3Input.value].filter(Boolean),
    outro: {
      headline: "Big Breaking Wire",
      tagline: "NEWS. FAST. FIRST.",
      subtext: "Like • Share • Subscribe"
    },
    durationInSeconds: currentVideoData.durationInSeconds || 22,
    words: currentVideoData.words || [],
    audioUrl: currentVideoData.audioUrl || "",
    bgMusicUrl: bgMusicSelect.value || "assets/news_beat.wav",
    subtitleColor: subColorSelect.value || "#DC0618"
  };

  renderStatusCard.classList.remove('hidden');
  statusMessage.innerText = "Encoding 3D video frames with Remotion & FFmpeg...";
  downloadContainer.classList.add('hidden');
  renderSpinner.classList.remove('hidden');
  renderMp4Btn.disabled = true;

  try {
    const result = await fetchJson('/api/render-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoProps: payloadProps, compositionId: 'BigBreakingWireVideo' })
    });

    if (result.success) {
      statusMessage.innerText = "✅ Video rendered successfully! Watch preview below:";
      downloadVideoLink.href = result.videoUrl;
      downloadVideoLink.setAttribute('download', result.filename);
      downloadContainer.classList.remove('hidden');

      mockupScreen.classList.add('hidden');
      renderedVideoPlayer.src = result.videoUrl;
      renderedVideoPlayer.classList.remove('hidden');
      renderedVideoPlayer.muted = false;
      renderedVideoPlayer.volume = 1.0;
      renderedVideoPlayer.play().catch(e => {
        console.log("Browser policy blocked unmuted autoplay:", e);
        renderedVideoPlayer.muted = true;
        renderedVideoPlayer.play().catch(() => {});
      });
    } else {
      statusMessage.innerText = `❌ Render error: ${result.error || 'Unknown error'}`;
    }
  } catch (err) {
    statusMessage.innerText = `❌ Request error: ${err.message}`;
  } finally {
    renderSpinner.classList.add('hidden');
    renderMp4Btn.disabled = false;
  }
}

renderMp4Btn.addEventListener('click', triggerRenderPipeline);

// ⚡ 1-Click Auto-Produce (End-to-End Pipeline in 1 Click)
quickProduceBtn.addEventListener('click', async () => {
  const isScriptMode = modeTabScript && modeTabScript.classList.contains('active');
  const url = urlInput.value.trim();
  const scriptText = (customScriptInput?.value || narrationScript?.value || '').trim();

  if (isScriptMode && !scriptText) {
    alert('Please enter or paste your script first!');
    return;
  }
  if (!isScriptMode && !url) {
    alert('Please enter an article URL first!');
    return;
  }

  quickProduceSpinner.classList.remove('hidden');
  quickProduceBtn.disabled = true;

  try {
    if (isScriptMode) {
      // 1. Extract from script & find image
      const parsedData = await fetchJson('/api/parse-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText,
          title: videoTitleInput.value.trim()
        })
      });
      if (!parsedData.success) throw new Error(parsedData.error || 'Script extraction failed');
      currentVideoData = parsedData.data;
      populateFormFromData(parsedData.data);
    } else {
      // 1. Scrape URL
      const scrapeData = await fetchJson('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!scrapeData.success) throw new Error(scrapeData.error || 'Scraping failed');
      currentVideoData = scrapeData.data;
      populateFormFromData(scrapeData.data);
    }

    // 2. Generate Voice
    const voiceData = await fetchJson('/api/generate-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: currentVideoData.fullNarration,
        voice: voiceSelect.value,
        rate: speechRateSelect.value
      })
    });
    if (!voiceData.success) throw new Error(voiceData.error || 'Voice generation failed');

    currentVideoData.audioUrl = voiceData.audioUrl;
    currentVideoData.durationInSeconds = voiceData.durationInSeconds;
    currentVideoData.words = voiceData.words;
    currentVideoData.generatedText = currentVideoData.fullNarration;
    currentVideoData.generatedVoice = voiceSelect.value;

    // 3. Render
    await triggerRenderPipeline();
  } catch (err) {
    alert(`1-Click Auto Produce Error: ${err.message}`);
  } finally {
    quickProduceSpinner.classList.add('hidden');
    quickProduceBtn.disabled = false;
  }
});

// Initialize on page load
populateFormFromData(currentVideoData);
