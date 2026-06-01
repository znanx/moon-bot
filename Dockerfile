FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./

RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "index.js", "--max-old-space-size=1024"]