const { fetchBRollForKeyword } = require('./broll');

/**
 * Intelligent Script Parser & Storyboard Extractor for BigBreakingWire
 * Converts any raw narration script or article text into a complete 9:16 Shorts storyboard:
 * - Extracts Headline, Category & Key Takeaways
 * - Finds & downloads matching high-res Stock/B-roll Imagery
 * - Generates Twitter Hook Card (Scene 1)
 * - Auto-detects Comparative Charts (Scene 2, if metrics exist)
 * - Generates Multi-Section 3D Article Cards (Scene 3)
 * - Polishes Full Narration & Pacing
 */

function extractKeywordsAndTopic(text) {
  const lower = text.toLowerCase();

  if (lower.includes('nvidia') || lower.includes('jensen') || lower.includes('gpu') || lower.includes('blackwell')) {
    return { topic: 'nvidia', category: 'Tech', imageQuery: 'nvidia' };
  }
  if (lower.includes('rbi') || lower.includes('shaktikanta') || lower.includes('repo rate') || lower.includes('monetary policy')) {
    return { topic: 'rbi', category: 'Economy', imageQuery: 'rbi' };
  }
  if (lower.includes('gdp') || lower.includes('india growth') || lower.includes('indian economy') || lower.includes('rupee')) {
    return { topic: 'gdp', category: 'Economy', imageQuery: 'india' };
  }
  if (lower.includes('gold') || lower.includes('silver') || lower.includes('bullion') || lower.includes('precious metal')) {
    return { topic: 'gold', category: 'Markets', imageQuery: 'gold' };
  }
  if (lower.includes('buffett') || lower.includes('berkshire') || lower.includes('treasury') || lower.includes('t-bill') || lower.includes('federal reserve') || lower.includes('fed')) {
    return { topic: 'finance', category: 'Finance', imageQuery: 'finance' };
  }
  if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('btc') || lower.includes('ethereum')) {
    return { topic: 'crypto', category: 'Crypto', imageQuery: 'crypto' };
  }
  if (lower.includes('trump') || lower.includes('tariff') || lower.includes('trade war') || lower.includes('xi jinping') || lower.includes('china')) {
    return { topic: 'trump', category: 'World', imageQuery: 'trump' };
  }
  if (lower.includes('real estate') || lower.includes('housing') || lower.includes('property')) {
    return { topic: 'realestate', category: 'Real Estate', imageQuery: 'realestate' };
  }
  if (lower.includes('stock') || lower.includes('nifty') || lower.includes('sensex') || lower.includes('nasdaq') || lower.includes('wall street')) {
    return { topic: 'finance', category: 'Markets', imageQuery: 'finance' };
  }
  if (lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('semiconductor') || lower.includes('chips')) {
    return { topic: 'tech', category: 'Tech', imageQuery: 'tech' };
  }
  if (lower.includes('oil') || lower.includes('petroleum') || lower.includes('energy') || lower.includes('crude')) {
    return { topic: 'oil', category: 'Energy', imageQuery: 'energy' };
  }

  return { topic: 'finance', category: 'Business', imageQuery: 'news' };
}

function generateHeadlineFromScript(scriptText, topicInfo) {
  const lines = scriptText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // If first line is short and looks like a title
  if (lines.length > 0 && lines[0].length < 90 && !lines[0].endsWith('.') && !lines[0].endsWith('!')) {
    return lines[0].replace(/^[#*-]\s*/, '');
  }

  const sentences = scriptText.replace(/[\n\r]+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean);
  const firstSentence = sentences[0] || "";

  // Extract company / subject + key metric
  const moneyMatch = firstSentence.match(/(\$|₹|Rs\.?\s?)[\d,.]+\s*(billion|million|trillion|crore|lakh|B|M|T)?/i);
  const percentMatch = firstSentence.match(/\b\d+(\.\d+)?%/);

  if (firstSentence.toLowerCase().includes('nvidia')) {
    return moneyMatch ? `NVIDIA Q2: Revenue Surges to ${moneyMatch[0]}` : "NVIDIA Dominates with Record-Breaking Surge";
  }
  if (firstSentence.toLowerCase().includes('rbi')) {
    return percentMatch ? `RBI Holds Benchmark Repo Rate at ${percentMatch[0]}` : "RBI Releases Crucial Monetary Policy Update";
  }
  if (firstSentence.toLowerCase().includes('gdp') || firstSentence.toLowerCase().includes('growth')) {
    return percentMatch ? `India Real GDP Growth Projected at Strong ${percentMatch[0]}` : "India Economic Growth & Market Forecast";
  }
  if (firstSentence.toLowerCase().includes('buffett')) {
    return moneyMatch ? `Warren Buffett Amasses ${moneyMatch[0]} in U.S. T-Bills` : "Warren Buffett's Record Strategic Move";
  }
  if (firstSentence.toLowerCase().includes('trump') || firstSentence.toLowerCase().includes('tariff')) {
    return percentMatch ? `U.S. Slashes Tariffs to ${percentMatch[0]} in Breakthrough Summit` : "Historic Summit Reaches Landmark Economic Deal";
  }

  // Fallback to first sentence summary
  const cleanSummary = firstSentence.replace(/^[^\w]+/, '').replace(/[\.!]$/, '');
  if (cleanSummary.length > 80) {
    return cleanSummary.substring(0, 77) + "...";
  }
  return cleanSummary || "Breaking Financial & Market Update";
}

function autoDetectChartFromScript(scriptText) {
  const text = scriptText.toLowerCase();

  // 1. Percentage Comparison
  const pctMatches = [...text.matchAll(/\b(\d+(?:\.\d+)?)\s*%/g)];
  if (pctMatches.length >= 2) {
    const val1 = parseFloat(pctMatches[0][1]);
    const val2 = parseFloat(pctMatches[1][1]);
    const diff = val2 - val1;
    const isPos = diff >= 0;

    return {
      enabled: true,
      type: "combo-trend",
      title: "Key Economic Rate Comparison",
      subtitle: "Benchmark Growth Metrics",
      prevLabel: "Previous Rate",
      prevValue: val1,
      prevFormatted: `${val1}%`,
      currLabel: "Current Target",
      currValue: val2,
      currFormatted: `${val2}%`,
      changeBadge: `${isPos ? '+' : ''}${diff.toFixed(1)}% SHIFT`,
      isPositive: isPos
    };
  }

  // 2. Billions / Dollars / Crores comparison
  const valMatches = [...text.matchAll(/(?:\$|₹|rs\.?\s*)(\d+(?:\.\d+)?)\s*(billion|million|trillion|crore|lakh|b|m|t)?/gi)];
  if (valMatches.length >= 2) {
    const num1 = parseFloat(valMatches[0][1]);
    const unit1 = valMatches[0][2] ? valMatches[0][2].toUpperCase() : 'B';
    const num2 = parseFloat(valMatches[1][1]);
    const unit2 = valMatches[1][2] ? valMatches[1][2].toUpperCase() : unit1;

    const diff = num2 - num1;
    const pctChange = num1 > 0 ? Math.round(((num2 - num1) / num1) * 100) : 0;
    const isPos = diff >= 0;

    return {
      enabled: true,
      type: "combo-trend",
      title: "Financial & Revenue Growth",
      subtitle: `in ${unit2} USD`,
      prevLabel: "Prior Benchmark",
      prevValue: num1,
      prevFormatted: `$${num1}${unit1.charAt(0)}`,
      currLabel: "Current Record",
      currValue: num2,
      currFormatted: `$${num2}${unit2.charAt(0)}`,
      changeBadge: `${isPos ? '+' : ''}${pctChange}% GROWTH`,
      isPositive: isPos
    };
  }

  return null;
}

/**
 * Main parser entry point
 */
async function parseScriptToStoryboard(rawScript, titleOverride = '') {
  if (!rawScript || typeof rawScript !== 'string' || !rawScript.trim()) {
    throw new Error('Script text cannot be empty');
  }

  // Sanitize text
  const cleanScript = rawScript
    .replace(/[*_~`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into raw sentences and merge short fragments (< 25 chars) into next sentence
  const rawSentences = cleanScript
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 2);

  const sentences = [];
  let buffer = '';
  for (const s of rawSentences) {
    if ((buffer + ' ' + s).trim().length < 35 && rawSentences.indexOf(s) < rawSentences.length - 1) {
      buffer = buffer ? `${buffer} ${s}` : s;
    } else {
      sentences.push(buffer ? `${buffer} ${s}` : s);
      buffer = '';
    }
  }
  if (buffer) sentences.push(buffer);

  const topicInfo = extractKeywordsAndTopic(cleanScript);
  const headline = titleOverride.trim() || generateHeadlineFromScript(cleanScript, topicInfo);

  // 1. Fetch / Find matching high-res image
  let heroImage = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1080&q=80";
  try {
    const brollResult = await fetchBRollForKeyword(topicInfo.imageQuery);
    if (brollResult && brollResult.url) {
      heroImage = brollResult.url.startsWith('http') ? brollResult.url : `/${brollResult.url}`;
    }
  } catch (err) {
    console.warn('[Script Parser] B-Roll lookup fallback:', err.message);
  }

  // 2. Twitter Hook Card (Scene 1)
  const hookSentence = sentences[0] || headline;
  const sentence2 = sentences[1] || "";
  const sentence3 = sentences[2] || "";

  const bulletPoints = [
    hookSentence.replace(/^[!—\s]+/, ''),
    sentence2,
    sentence3
  ].filter(s => s && s.length > 15).slice(0, 3);

  // If only 1 or 2 bullet points, ensure at least 2 substantive points
  if (bulletPoints.length === 1) {
    bulletPoints.push("Follow for in-depth daily intelligence and verified reports.");
  }

  const highlightMatch = hookSentence.match(/(\$|₹|Rs\.?\s?)[\d,.]+\s*(billion|million|trillion|crore|lakh|B|M|T)?|\b\d+(\.\d+)?%|record|massive|shattered|highest|surged|surges/i);
  const highlightPhrase = highlightMatch ? highlightMatch[0] : (bulletPoints[0]?.slice(0, 35) || "Breaking Market Update");

  // 3. Auto-Detect Chart
  const chartData = autoDetectChartFromScript(cleanScript);

  // 4. Storyboard Article Sections (Scene 3)
  const articleSections = [];
  
  if (sentences.length >= 4) {
    articleSections.push({
      heading: "⚡ Key Development",
      content: `${sentences[1]} ${sentences[2]}`,
      highlight: sentences[1].slice(0, 45)
    });
    articleSections.push({
      heading: "📊 Market Impact & Outlook",
      content: sentences.slice(3, 5).join(' '),
      highlight: sentences[3]?.slice(0, 45) || "Major Market Shift"
    });
  } else if (sentences.length >= 2) {
    articleSections.push({
      heading: "⚡ Breaking Key Takeaway",
      content: sentences.slice(1).join(' '),
      highlight: sentences[1]?.slice(0, 45) || "Key Update"
    });
  } else {
    articleSections.push({
      heading: "⚡ Verified Flash Report",
      content: hookSentence,
      highlight: highlightPhrase
    });
  }

  // 5. Polish Narration
  let fullNarration = cleanScript;
  if (!fullNarration.toLowerCase().includes('follow bigbreakingwire')) {
    fullNarration = `${fullNarration.replace(/[.\s]+$/, '')}. Follow BigBreakingWire for daily breaking market updates.`;
  }

  // Estimate duration
  const words = fullNarration.split(/\s+/).filter(Boolean);
  const durationInSeconds = Math.max(16, Math.min(58, Math.round((words.length / 150) * 60)));

  return {
    title: headline,
    hookHeadline: bulletPoints[0] || headline,
    domain: "bigbreakingwire.in",
    category: topicInfo.category,
    imageUrl: heroImage,
    twitterCard: {
      accountName: "BigBreakingWire",
      handle: "@BigBreakingWire",
      verified: true,
      text: bulletPoints[0] || headline,
      bulletPoints,
      highlightPhrase
    },
    chartData,
    articleSections,
    takeaways: bulletPoints,
    fullNarration,
    outro: {
      headline: "Big Breaking Wire",
      tagline: "NEWS. FAST. FIRST.",
      subtext: "Subscribe for Daily Financial Intelligence"
    },
    durationInSeconds,
    words: [],
    audioUrl: ""
  };
}

module.exports = {
  parseScriptToStoryboard,
  extractKeywordsAndTopic,
  autoDetectChartFromScript
};
