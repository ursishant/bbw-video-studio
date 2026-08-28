# 🚀 BigBreakingWire Video Studio • Local Setup & Cloud Hosting Guide

Everything you need to run the studio **locally on `localhost:3000`** or **host it 24/7 on the cloud**.

---

## 💻 1. How to Use on Localhost (Immediate)

### Start the Server:
Open your Terminal (macOS/Linux) or Command Prompt (Windows) inside the `BBW Video` directory:
```bash
npm start
```

### Open in Browser:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 2. Instant Live Shareable URL (No Setup Needed)
If you want to access the studio from your phone or share the link with someone right now:
👉 **[https://eddie-warrior-halo-estimation.trycloudflare.com](https://eddie-warrior-halo-estimation.trycloudflare.com)**

To start a new instant public link at any time:
```bash
npx -y cloudflared tunnel --url http://localhost:3000
```

---

## ☁️ 3. Permanent 24/7 Cloud Hosting Guide

You can host this entire studio permanently with **1-Click Docker** on any cloud platform:

### Option A: Deploy to Railway (Recommended - Free / Easy)
1. Push this folder to a GitHub repository.
2. Go to **[Railway.app](https://railway.app)** and click **New Project** ➔ **Deploy from GitHub repo**.
3. Railway automatically detects the `Dockerfile` and deploys it on a custom `*.up.railway.app` domain.
4. Set the port environment variable to `PORT=3000`.

### Option B: Deploy to Render
1. Go to **[Render.com](https://render.com)** ➔ **New Web Service**.
2. Connect your GitHub repository.
3. Select **Docker** as the runtime environment.
4. Set Port to `3000`. Click **Deploy**!

### Option C: Deploy with Fly.io (CLI)
```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Launch & Deploy
fly launch
fly deploy
```

### Option D: Deploy to Any VPS / Ubuntu Server (DigitalOcean, AWS, Linode)
```bash
# 1. Install Docker on your server
sudo apt-get update && sudo apt-get install -y docker.io

# 2. Clone/Upload your folder and build
docker build -t bbw-studio .

# 3. Run in background (starts automatically on reboot)
docker run -d --restart always -p 3000:3000 --name bbw-studio bbw-studio
```
Then visit `http://your-server-ip:3000`.

---

## ⚡ Studio Features Recap:
- **`⚡ 1-Click Auto-Produce Short`**: End-to-end automation from URL to MP4 in one tap.
- **Smart Chart Auto-Detection**: Pulls numerical statistics directly from news articles.
- **Ryan Multilingual Neural**: Default British broadcast voice with word-level subtitle sync.
- **1080x1920 Remotion Render**: Broadcast-quality 3D vertical shorts with continuous supportive text scrolling.
