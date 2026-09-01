const { fetchBRollForKeyword } = require('./broll');

/**
 * Intelligent Script Parser & Storyboard Extractor for BigBreakingWire
 * Converts any raw narration script, bullet notes, or article text into a complete 9:16 Shorts storyboard:
 * - Sanitizes dirty markdown (**, *, ~~), URI encodings (%20, %22, %2C), and HTML tags
 * - Detects & extracts structured section blocks (handling heading lines cleanly with NO duplicate words)
 * - Finds & downloads matching high-res Stock/B-roll Imagery
 * - Generates Twitter Hook Card (Scene 1)
 * - Auto-detects Comparative Charts (Scene 2, if metrics exist)
 * - Generates Multi-Section 3D Article Cards (Scene 3)
 * - Polishes Full Narration & Pacing
 */

/**
 * Clean dirty formatting artifacts from raw user inputs:
 * - URL Encoded characters (e.g. %20 -> space, %27 -> ', %22 -> ", %2C -> ,, etc.)
 * - Markdown bold/italics/strikethrough/backticks (**, *, __, _, ~~, ```, `)
 * - HTML entities & tags (<p>, &nbsp;, &amp;, etc.)
 * - Stray punctuation and excess whitespace
 */
function cleanRawText(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // 1. URL Decode percent-encoded strings (%20, %22, %27, %2C, %26, etc.)
  try {
    if (/%[0-9A-Fa-f]{2}/.test(cleaned)) {
      cleaned = decodeURIComponent(cleaned.replace(/\+/g, '%20'));
    }
  } catch (e) {
    // Manual fallback for common URL encodings
    cleaned = cleaned
      .replace(/%20/gi, ' ')
      .replace(/%22/gi, '"')
      .replace(/%27/gi, "'")
      .replace(/%26/gi, '&')
      .replace(/%2C/gi, ',')
      .replace(/%2F/gi, '/')
      .replace(/%3A/gi, ':')
      .replace(/%3F/gi, '?')
      .replace(/%3D/gi, '=')
      .replace(/%2B/gi, '+')
      .replace(/%0A/gi, '\n')
      .replace(/%0D/gi, '');
  }

  // 2. Remove Markdown bold, italics, strikethrough, backticks, citations
  cleaned = cleaned
    .replace(/\*\*(.*?)\*\*/g, '$1')     // **bold** -> bold
    .replace(/\*(.*?)\*/g, '$1')         // *italic* -> italic
    .replace(/__(.*?)__/g, '$1')         // __bold__ -> bold
    .replace(/_(.*?)_/g, '$1')           // _italic_ -> italic
    .replace(/~~(.*?)~~/g, '$1')         // ~~strike~~ -> strike
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // `code` -> code
    .replace(/\[\d+\]/g, '')             // [1], [2] citations -> empty
    .replace(/\*{2,}/g, '')              // leftover stray **
    .replace(/_{2,}/g, '');              // leftover stray __

  // 3. Clean HTML tags & entities
  cleaned = cleaned
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–');

  // 4. Remove leftover markdown headers/bullets at line starts while preserving structure
  cleaned = cleaned
    .split('\n')
    .map(line => {
      return line
        .replace(/^#{1,6}\s+/, '')      // ### Header
        .replace(/^[\*\-\+\•\–\—]\s+/, '') // * bullet or - bullet
        .replace(/^\d+[\.\)]\s+/, '')    // 1. bullet or 1) bullet
        .trim();
    })
    .join('\n');

  // 5. Clean excessive spaces
  cleaned = cleaned
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  return cleaned;
}

function extractKeywordsAndTopic(text) {
  const lower = text.toLowerCase();

  if (lower.includes('nvidia') || lower.includes('jensen') || lower.includes('gpu') || lower.includes('blackwell')) {
    return { topic: 'nvidia', category: 'Tech', imageQuery: 'nvidia' };
  }
  if (lower.includes('rbi') || lower.includes('shaktikanta') || lower.includes('repo rate') || lower.includes('monetary policy')) {
    return { topic: 'rbi', category: 'Economy', imageQuery: 'rbi' };
  }
  if (lower.includes('gdp') || lower.includes('india growth') || lower.includes('indian economy') || lower.includes('rupee') || lower.includes('lakh crore') || lower.includes('india’s gdp') || lower.includes("india's gdp")) {
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

/**
 * Clean duplicate consecutive words or glued heading prefixes
 * e.g., "Services Lead Services lead..." -> "Services lead..."
 * "GDP Growth India's GDP growth..." -> "India's GDP growth..."
 */
function cleanDuplicateConsecutiveWords(text) {
  if (!text) return text;
  let cleaned = cleanRawText(text);

  // 1. Remove duplicate adjacent phrases e.g. "Services Lead Services lead..." -> "Services lead..."
  // "Investment Surges Investment surges..." -> "Investment surges..."
  cleaned = cleaned.replace(/^([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+){0,2})[:\s—.-]+\1\b/i, '$1');

  // 2. Remove glued short section tags followed by full sentence starting with Capital letter
  // e.g. "GDP Growth India's GDP..." -> "India's GDP..."
  // "Output Rises Real GDP rises..." -> "Real GDP rises..."
  // "Exports Boom Transport goods exports..." -> "Transport goods exports..."
  cleaned = cleaned.replace(/^(?:GDP Growth|Output Rises|Exports Boom|Breaking News|Market Update|Key Takeaway)[:\s—.-]+(?=[A-Z][a-z])/i, '');

  return cleaned.trim();
}

/**
 * Parses raw text into clean semantic blocks (pairing subheadings with their content)
 */
function parseScriptBlocks(rawText) {
  const sanitized = cleanRawText(rawText);
  const lines = sanitized.replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(Boolean);
  const blocks = [];

  let currentHeading = null;
  let currentParagraphs = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line looks like a subheading: short (< 40 chars), doesn't end with sentence punctuation (.!?), or starts with #/bullet
    const isHeading =
      (line.length < 40 && !/[.!?]$/.test(line) && !line.includes('http') && !line.includes('%') && !line.includes('₹') && !line.includes('$')) ||
      /^#{1,4}\s+/.test(line) ||
      /^[A-Z\s]{3,30}$/.test(line);

    if (isHeading && (i + 1 < lines.length || currentParagraphs.length > 0)) {
      if (currentHeading || currentParagraphs.length > 0) {
        blocks.push({
          heading: currentHeading,
          content: currentParagraphs.join(' ').trim()
        });
      }
      currentHeading = line.replace(/^#{1,4}\s*/, '').replace(/[:—]+$/, '').trim();
      currentParagraphs = [];
    } else {
      currentParagraphs.push(line);
    }
  }

  if (currentHeading || currentParagraphs.length > 0) {
    blocks.push({
      heading: currentHeading,
      content: currentParagraphs.join(' ').trim()
    });
  }

  return blocks;
}

function generateHeadlineFromScript(scriptText, topicInfo) {
  const clean = cleanRawText(scriptText).replace(/[\n\r]+/g, ' ').trim();
  const percentMatch = clean.match(/\b\d+(\.\d+)?%/);
  const moneyMatch = clean.match(/(\$|₹|Rs\.?\s?)[\d,.]+\s*(billion|million|trillion|crore|lakh|B|M|T)?/i);

  if (clean.toLowerCase().includes('gdp') || clean.toLowerCase().includes('india')) {
    if (percentMatch) return `India Real GDP Growth Surges to ${percentMatch[0]}`;
    return "India Economic Growth & Market Expansion";
  }
  if (clean.toLowerCase().includes('nvidia')) {
    if (moneyMatch) return `NVIDIA Q2: Revenue Hits Record ${moneyMatch[0]}`;
    return "NVIDIA Shatters Wall Street with Record Quarter";
  }
  if (clean.toLowerCase().includes('rbi')) {
    if (percentMatch) return `RBI Holds Policy Repo Rate at ${percentMatch[0]}`;
    return "RBI MPC Monetary Policy Decision";
  }
  if (clean.toLowerCase().includes('buffett')) {
    if (moneyMatch) return `Warren Buffett Holds ${moneyMatch[0]} in U.S. T-Bills`;
    return "Warren Buffett's Record Strategic Move";
  }
  if (clean.toLowerCase().includes('trump') || clean.toLowerCase().includes('tariff')) {
    if (percentMatch) return `U.S. Slashes Tariffs to ${percentMatch[0]} in Breakthrough Summit`;
    return "Historic Trade Deal & Economic Summit";
  }

  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const firstSentence = sentences[0] || "Breaking Market Update";
  if (firstSentence.length > 80) {
    return firstSentence.substring(0, 77) + "...";
  }
  return firstSentence;
}

function autoDetectChartFromScript(scriptText) {
  const text = cleanRawText(scriptText).toLowerCase();

  // 1. Lakh Crore comparison (e.g. ₹81.36 lakh crore from ₹75.46 lakh crore)
  const lakhCroreMatches = [...text.matchAll(/(?:₹|rs\.?\s*)(\d+(?:\.\d+)?)\s*lakh\s*crore/gi)];
  if (lakhCroreMatches.length >= 2) {
    const v1 = parseFloat(lakhCroreMatches[1][1]);
    const v2 = parseFloat(lakhCroreMatches[0][1]);
    const num1 = Math.min(v1, v2);
    const num2 = Math.max(v1, v2);
    const pctChange = (((num2 - num1) / num1) * 100).toFixed(1);

    return {
      enabled: true,
      type: "combo-trend",
      title: "Real GDP Output (₹ Lakh Crore)",
      subtitle: "Year-on-Year Expansion",
      prevLabel: "FY26 Q1",
      prevValue: num1,
      prevFormatted: `₹${num1}L Cr`,
      currLabel: "FY27 Q1",
      currValue: num2,
      currFormatted: `₹${num2}L Cr`,
      changeBadge: `+${pctChange}% EXPANSION`,
      isPositive: true
    };
  }

  // 2. Percentage Comparison
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
      prevLabel: "Base Rate",
      prevValue: val1,
      prevFormatted: `${val1}%`,
      currLabel: "Growth Rate",
      currValue: val2,
      currFormatted: `${val2}%`,
      changeBadge: `${isPos ? '+' : ''}${diff.toFixed(1)}% SHIFT`,
      isPositive: isPos
    };
  }

  // 3. Billions / Dollars comparison
  const valMatches = [...text.matchAll(/(?:\$|₹|rs\.?\s*)(\d+(?:\.\d+)?)\s*(billion|million|trillion|b|m|t)?/gi)];
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
      prevLabel: "Prior Period",
      prevValue: num1,
      prevFormatted: `$${num1}${unit1.charAt(0)}`,
      currLabel: "Current Period",
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
async function parseScriptToStoryboard(rawScript, titleOverride = '', sceneOrder = 'hook-first') {
  if (!rawScript || typeof rawScript !== 'string' || !rawScript.trim()) {
    throw new Error('Script text cannot be empty');
  }

  const cleanScript = cleanRawText(rawScript);
  const topicInfo = extractKeywordsAndTopic(cleanScript);

  // Generate or determine headline
  let headline = cleanRawText(titleOverride).trim();
  if (!headline || (headline.toLowerCase().includes('nvidia') && topicInfo.topic !== 'nvidia')) {
    headline = generateHeadlineFromScript(cleanScript, topicInfo);
  }

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

  // 2. Parse into structured blocks with clean headings & deduplicated content
  const blocks = parseScriptBlocks(cleanScript);

  const cleanSentences = [];
  const articleSections = [];

  const headingIcons = ['⚡', '📈', '🏢', '💼', '🚢', '🔥', '📌', '📊'];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const cleanContent = cleanDuplicateConsecutiveWords(b.content);
    if (!cleanContent) continue;

    cleanSentences.push(cleanContent);

    // Pick icon
    const icon = headingIcons[i % headingIcons.length];
    const headingText = b.heading ? `${icon} ${cleanRawText(b.heading)}` : `${icon} Key Takeaway ${i + 1}`;

    articleSections.push({
      heading: headingText,
      content: cleanContent,
      highlight: cleanContent.slice(0, 45)
    });
  }

  // If no structured blocks were found, fallback to sentence splitting
  if (cleanSentences.length === 0) {
    const rawSentences = cleanScript
      .split(/(?<=[.!?])\s+/)
      .map(s => cleanRawText(s).trim())
      .filter(s => s.length > 10);

    for (let i = 0; i < rawSentences.length; i++) {
      const s = rawSentences[i];
      cleanSentences.push(s);
      articleSections.push({
        heading: `⚡ Takeaway ${i + 1}`,
        content: s,
        highlight: s.slice(0, 45)
      });
    }
  }

  // 3. Twitter Hook Card Bullet Points (Scene 1)
  const bulletPoints = cleanSentences.slice(0, 3).map(s => {
    return cleanRawText(s).replace(/^[!—\s]+/, '').trim();
  });

  if (bulletPoints.length === 1) {
    bulletPoints.push("Follow for in-depth daily intelligence and verified market reports.");
  }

  const hookSentence = bulletPoints[0] || headline;
  const highlightMatch = hookSentence.match(/(\$|₹|Rs\.?\s?)[\d,.]+\s*(billion|million|trillion|crore|lakh|B|M|T)?|\b\d+(\.\d+)?%|record|massive|shattered|highest|surges|surged/i);
  const highlightPhrase = highlightMatch ? highlightMatch[0] : (bulletPoints[0]?.slice(0, 35) || "Breaking Market Update");

  // 4. Auto-Detect Chart
  const chartData = autoDetectChartFromScript(cleanScript);

  // 5. Build clean, non-repetitive narration script
  let fullNarration = cleanSentences.join(' ').replace(/\s+/g, ' ').trim();
  if (!fullNarration.toLowerCase().includes('follow bigbreakingwire')) {
    fullNarration = `${fullNarration.replace(/[.\s]+$/, '')}. Follow BigBreakingWire for daily breaking market updates.`;
  }

  // Estimate duration
  const wordCount = fullNarration.split(/\s+/).filter(Boolean).length;
  const durationInSeconds = Math.max(18, Math.min(58, Math.round((wordCount / 150) * 60)));

  return {
    title: headline,
    hookHeadline: bulletPoints[0] || headline,
    domain: "bigbreakingwire.in",
    category: topicInfo.category,
    imageUrl: heroImage,
    sceneOrder: sceneOrder || 'hook-first',
    twitterCard: {
      accountName: "BigBreakingWire",
      handle: "@BigBreakingWire",
      verified: true,
      text: bulletPoints[0] || headline,
      bulletPoints,
      highlightPhrase
    },
    chartData,
    articleSections: articleSections.slice(0, 4),
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
  autoDetectChartFromScript,
  parseScriptBlocks,
  cleanDuplicateConsecutiveWords,
  cleanRawText
};
