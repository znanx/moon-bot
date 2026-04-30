# MOON BOT
Unofficial WhatsApp bot with modular plugins, built on top of Baileys and `@znan/wabot`.

[![Forks](https://img.shields.io/github/forks/znanx/moon-bot?style=flat-square)](https://github.com/znanx/moon-bot/network/members)
[![Stars](https://img.shields.io/github/stars/znanx/moon-bot?style=flat-square)](https://github.com/znanx/moon-bot/stargazers)
[![License](https://img.shields.io/github/license/znanx/moon-bot?style=flat-square)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/znanx/moon-bot?style=flat-square)](https://github.com/znanx/moon-bot/issues)

## Documentation
- Bahasa Indonesia: [`docs/ID.md`](./docs/ID.md)
- English: [`docs/EN.md`](./docs/EN.md)

## Highlights
- Plugin-first architecture.
- Supports command plugins and event plugins.
- Built-in anti-spam, anti-link, anti-delete, anti-call, and other moderation tools.
- Auto database save and optional scheduled owner backup.
- Optional HTTP health server (`npm run server`) for hosting environments.

## Requirements
- Node.js `>= 22.x`
- FFmpeg
- ImageMagick
- WebP tools
- WhatsApp account number
- API key for Alya API (required by API-based features)

## Community & Discussions
- [WhatsApp Group](https://s.id/12eiZ)
- [Telegram Group](https://s.id/nDpNX)

## Quick Start
```bash
git clone https://github.com/znanx/moon-bot.git
cd moon-bot
npm install
```

Create `.env` in the project root:

```env
API_ENDPOINT='https://api.alyachan.dev/api'
API_KEY='your_api_key'
DATABASE_URL=''
TZ='Asia/Jakarta'
```

Update [`config.json`](./config.json):
- `owner` and `owner_name`
- `pairing.number` (your WhatsApp number)
- `pairing.state` (`true` to use pairing mode)

Run the bot:

```bash
npm start
```

## Run Modes
- `npm start`: run main bot process (auto restart handled by `index.js`).
- `npm run server`: run bot with HTTP status endpoint from [`server.js`](./server.js).
- `npm run pm2`: start with PM2 (or use [`pm2.config.js`](./pm2.config.js)).

## Core Structure
- [`index.js`](./index.js): process bootstrap and auto-restart supervisor.
- [`main.js`](./main.js): WhatsApp connection, DB init, periodic jobs, listener setup.
- [`handler.js`](./handler.js): command/event routing and permission checks.
- `plugins/`: bot features grouped by categories.
- `lib/system/`: internal helpers, schema, listeners, anti-spam, and models.

## Security
Please read [`SECURITY.md`](./SECURITY.md) before deploying to production.

## Notes
- This project is still actively developed.
- This is an unofficial WhatsApp automation project; use it responsibly and at your own risk.
