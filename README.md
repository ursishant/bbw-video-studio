# 🎬 BigBreakingWire • Automated AI Video Studio

> **High-Retention, Professional 9:16 Short-Form Financial & News Video Generator**  
> Powered by **Remotion**, **Edge-TTS Neural Voices**, **Automated Internet B-Roll**, **3D Motion Graphics**, and **Adaptive Financial Charts**.

---

## 🌟 Key Capabilities

- **⚡ Instant Article Scraping & Scripting**: Paste any article URL from `bigbreakingwire.in` or news media to automatically extract headlines, key takeaways, and viral narration scripts.
- **🎙️ 16 Open-Source Neural Voices**: Featuring **Ryan Multilingual Neural (`en-US-RyanMultilingualNeural`)** as the primary broadcast voice, along with Eric, Guy, Christopher, Andrew, and international presenters.
- **📹 Automated Internet B-Roll Media**: Intelligent keyword-based 1080p stock footage and image acquisition (`server/broll.js`).
- **📊 Adaptive 3D Financial Charts**:
  - **📊 Multi-Period Bars + Trendline (`combo-trend`)**: Multi-quarter timeline columns with SVG trend curves and circular data markers.
  - **📈 Glowing Area Spline (`area-spline`)**: Fluid gradient area curves for macro/price trends.
  - **🍩 Donut Breakdown (`donut-breakdown`)**: Radial segment breakdowns with percentage callouts.
  - Live rolling numeric counters and floating surge delta badges (`▲ +106% YoY SURGE`).
- **📜 Continuous Supportive Article Scrolling**: 3D perspective article reader that smoothly scrolls supportive paragraphs from start to finish while highlighting active stats in fluorescent yellow.
- **🔔 Echo-Free Harmonic Outro**: Clean 3-note broadcast chime with animated YouTube / social CTA (zero duplicate voice echo).
- **📱 In-Browser 9:16 HTML5 Video Player**: Watch and preview the rendered MP4 short directly in the studio dashboard before downloading.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `3.8+` with `edge-tts`:
  ```bash
  pip3 install edge-tts
  ```
- **FFmpeg**: (Pre-installed on macOS/Linux or via package manager)

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "BBW Video"

# Install Node dependencies
npm install
```

### 3. Start the Web Studio
```bash
npm start
# or
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🐳 Docker Cloud Deployment

The project includes a production-ready `Dockerfile` with Node.js, Chromium, FFmpeg, and Python `edge-tts` pre-configured.

### Build and Run Locally with Docker:
```bash
docker build -t bbw-video-studio .
docker run -p 3000:3000 bbw-video-studio
```

### 1-Click Cloud Hosting:
Deploy seamlessly to:
- **Railway**: Connect your Git repository, set port to `3000`.
- **Render**: Create a Web Service from the Dockerfile.
- **Fly.io**: Run `fly launch` and `fly deploy`.
- **VPS / DigitalOcean / AWS**: Run the Docker container on port `3000`.

---

## 📁 Project Architecture & Directory Map

```text
├── public/
│   ├── assets/              # Logos, audio SFX (chimes, clicks, beats)
│   ├── audio/               # Generated voiceovers & audition samples
│   ├── broll/               # Cached 1080p B-roll footage & images
│   ├── outputs/             # Rendered 1080x1920 MP4 video shorts
│   └── studio/              # Web Studio frontend UI (HTML, CSS, JS)
│       ├── index.html       # Studio Dashboard
│       ├── style.css        # Brand design system
│       └── app.js           # Frontend interactivity & Remotion client
├── server/
│   ├── index.js             # Express API Server & Remotion render runner
│   ├── scraper.js           # Cheerio-based web article scraper
│   ├── tts.js               # Edge-TTS neural speech & timestamp engine
│   └── broll.js             # Internet B-roll media downloader
├── src/
│   ├── composition/
│   │   ├── components/
│   │   │   ├── HeaderLogo.tsx        # Persistent top brand badge
│   │   │   ├── TwitterCard.tsx       # 3D Twitter/X hook card
│   │   │   ├── ArticleView.tsx       # 3D Article reader with scrolling text
│   │   │   ├── AnimatedChartScene.tsx# Adaptive 3D Financial Charts
│   │   │   ├── DynamicSubtitles.tsx  # Word-by-word active pill subtitles
│   │   │   └── OutroCTA.tsx          # Broadcast harmonic outro
│   │   └── BigBreakingWireVideo.tsx  # Master 9:16 Shorts Sequence
│   ├── Root.tsx             # Remotion Root composition registry
│   ├── index.ts             # Entry point
│   ├── theme.ts             # Official brand design tokens
│   └── types.ts             # TypeScript schemas and props
├── Dockerfile               # Production container image
├── package.json             # NPM scripts & dependencies
└── tsconfig.json            # TypeScript configuration
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/voices` | `GET` | Returns catalog of 16 neural voice models with sample audio URLs. |
| `/api/scrape` | `POST` | Scrapes an article URL and extracts title, image, bullet points, and sections. |
| `/api/generate-voice` | `POST` | Synthesizes voiceover with edge-tts and returns word timestamps. |
| `/api/broll` | `POST` | Fetches and caches high-definition B-roll media matching keyword topics. |
| `/api/render-video` | `POST` | Spawns Remotion CLI to render full 1080x1920 3D MP4 video. |

---

## 🎨 Official Brand Color Palette

| Role | Color Name | HEX | Usage |
|---|---|---|---|
| 🔵 **Primary Navy** | Deep Navy | `#02225E` | Logo, primary headlines, main brand accents |
| 🔴 **Breaking Red** | Strong Red | `#DC0618` | Breaking badges, chart trendlines, active subtitle words |
| 🔵 **Navy Dark** | Midnight Navy | `#011638` | Subtitle pill, dark chart cards, header/footer |
| 🔵 **Navy Light** | News Blue | `#174A91` | Secondary buttons, links, borders |
| ⚪ **White** | Pure White | `#FFFFFF` | Main card backgrounds, reverse logo |
| ⚫ **Black** | Editorial Black | `#0B0D10` | Body headlines and high-contrast text |
| ⚪ **News Gray** | News Gray | `#F3F5F7` | Canvas background, section backgrounds |
| 🟡 **Highlight Yellow**| Highlighter | `#FEF08A` | Multi-line fluorescent text highlights |

---

## 📄 License & Handover
Developed for **BigBreakingWire**. 100% royalty-free, open-source stack with no external recurring SaaS subscription fees.
