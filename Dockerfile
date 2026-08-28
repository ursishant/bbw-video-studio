# BigBreakingWire Automated Video Studio Dockerfile
FROM node:20-bullseye-slim

# Install system dependencies: Chromium, FFmpeg, Python3, pip, and required fonts
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    python3 \
    python3-pip \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-montserrat \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome executable for Remotion rendering
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_BIN=/usr/bin/chromium
ENV PORT=3000

WORKDIR /app

# Install Python edge-tts library
RUN pip3 install --no-cache-dir edge-tts

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy project source
COPY . .

# Generate static SFX and voice preview samples
RUN python3 server/generate_sfx.py && python3 server/generate_voice_previews.py

EXPOSE 3000

CMD ["node", "server/index.js"]
