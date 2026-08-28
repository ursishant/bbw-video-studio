const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BROLL_DIR = path.join(__dirname, '../public/broll');
if (!fs.existsSync(BROLL_DIR)) {
  fs.mkdirSync(BROLL_DIR, { recursive: true });
}

// Verified high-res open B-Roll stock media (direct 1080p imagery & open video footage)
const CURATED_BROLL_MEDIA = {
  'tech': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=85', // Circuit microchip
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=85', // Datacenter server racks
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=85'  // Glowing cyber neon
  ],
  'finance': [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=85', // Stock trading candlestick chart
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1920&q=85', // Wall street trading displays
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1920&q=85'  // Global currency notes
  ],
  'news': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=85', // Modern skyscraper business district
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1920&q=85', // Fast metropolis traffic
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&q=85'  // Executive meeting
  ],
  'nvidia': [
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1920&q=85', // Computer GPU processor
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=85'  // Server cluster
  ],
  'rbi': [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1920&q=85', // Central banking & currency
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=85'  // Financial tower
  ]
};

// Download helper with redirect handling
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status Code ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    });

    request.on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });

    request.setTimeout(12000, () => {
      request.destroy();
      fs.unlink(destPath, () => {});
      reject(new Error(`Download timeout`));
    });
  });
}

// Fetch B-Roll for any keyword
async function fetchBRollForKeyword(keyword = 'finance') {
  const cleanKey = keyword.toLowerCase().trim();
  const slug = cleanKey.replace(/[^a-z0-9]+/g, '_');
  const localFileName = `broll_${slug}.jpg`;
  const localFilePath = path.join(BROLL_DIR, localFileName);
  const publicRelativeUrl = `broll/${localFileName}`;

  // If already cached locally
  if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 10000) {
    return {
      keyword,
      url: publicRelativeUrl,
      localPath: localFilePath,
      type: 'image',
      cached: true
    };
  }

  // Pick matching media URL
  let mediaUrl = null;
  for (const cat of Object.keys(CURATED_BROLL_MEDIA)) {
    if (cleanKey.includes(cat) || cat.includes(cleanKey)) {
      const list = CURATED_BROLL_MEDIA[cat];
      mediaUrl = list[Math.floor(Math.random() * list.length)];
      break;
    }
  }

  if (!mediaUrl) {
    if (cleanKey.includes('chip') || cleanKey.includes('ai') || cleanKey.includes('gpu') || cleanKey.includes('tech')) {
      mediaUrl = CURATED_BROLL_MEDIA['tech'][0];
    } else if (cleanKey.includes('rate') || cleanKey.includes('bank') || cleanKey.includes('market') || cleanKey.includes('stock')) {
      mediaUrl = CURATED_BROLL_MEDIA['finance'][0];
    } else {
      mediaUrl = CURATED_BROLL_MEDIA['news'][0];
    }
  }

  console.log(`[B-Roll Engine] Fetching B-roll for "${keyword}"...`);
  try {
    await downloadFile(mediaUrl, localFilePath);
    console.log(`[B-Roll Engine] Saved locally to ${localFileName}`);
    return {
      keyword,
      url: publicRelativeUrl,
      localPath: localFilePath,
      type: 'image',
      cached: false
    };
  } catch (err) {
    console.warn(`[B-Roll Engine] Download fallback to direct URL: ${err.message}`);
    return {
      keyword,
      url: mediaUrl,
      type: 'image',
      cached: false
    };
  }
}

module.exports = {
  fetchBRollForKeyword,
  CURATED_BROLL_MEDIA,
  BROLL_DIR
};
