# BigBreakingWire Automated Video Studio Dockerfile
FROM node:20-bookworm-slim

# Install system dependencies: Chromium, FFmpeg, Python3, pip, and system fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ffmpeg \
    python3 \
    python3-pip \
    python3-setuptools \
    fonts-liberation \
    fonts-dejavu-core \
    fonts-freefont-ttf \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome executable for Remotion rendering
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_BIN=/usr/bin/chromium
ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /app

# Install Python edge-tts library (using --break-system-packages on Debian 12)
RUN pip3 install --no-cache-dir --break-system-packages edge-tts || pip3 install --no-cache-dir edge-tts

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy all project source files, assets, audio, and studio UI
COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]
