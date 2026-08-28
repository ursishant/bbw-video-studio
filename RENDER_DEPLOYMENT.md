# 🚀 Deploy BigBreakingWire Video Studio to Render (Step-by-Step)

The project is fully configured with a production **`Dockerfile`** and **`render.yaml`** blueprint for Render.

---

## ⚡ 2-Minute Deployment Steps

### Step 1: Create a Repository on GitHub
1. Open your browser and go to: **[https://github.com/new](https://github.com/new)**.
2. Name the repository: `bbw-video-studio` (can be Public or Private).
3. Click **Create repository**.

---

### Step 2: Push the Code from Your Mac
Open your Terminal inside the `BBW Video` folder and run these 3 commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bbw-video-studio.git
git push -u origin main
```

---

### Step 3: Deploy on Render
1. Go to **[https://dashboard.render.com](https://dashboard.render.com)**.
2. Click **New +** in the top right ➔ Select **Web Service** (or **Blueprint**).
3. Select your GitHub repository (`bbw-video-studio`).
4. Choose the settings:
   - **Environment**: `Docker` (Auto-detected)
   - **Region**: `Oregon (US West)` or `Frankfurt (EU)`
   - **Instance Type**: `Free` or `Starter` (Starter recommended for faster Remotion video rendering)
   - **Port**: `3000`
5. Click **Create Web Service**!

---

## 🎉 Done!
Render will build the Docker container and provide a permanent live URL:
👉 `https://bbw-video-studio.onrender.com`

---

## 🔧 Pre-Configured Environment Variables (Automatic)
Render will automatically use these variables from `render.yaml`:
- `PORT`: `3000`
- `PUPPETEER_EXECUTABLE_PATH`: `/usr/bin/chromium`
- `CHROME_BIN`: `/usr/bin/chromium`
