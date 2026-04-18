# Moon Bot Documentation (EN)
This document covers setup, configuration, and plugin development for Moon Bot.

- Back to root: [`README.md`](../README.md)
- Indonesian docs: [`ID.md`](./ID.md)

## Requirements
- Node.js `>= 22.x`
- FFmpeg
- ImageMagick
- WebP tools
- Active WhatsApp number
- Alya API key for API-based features

## Recommended Hosting
- VPS/RDP (for example DigitalOcean)
- NAT VPS providers
- Node.js hosting panels
- Railway/Supabase/MongoDB Atlas for cloud database

## Quick Installation
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

Notes:
- Leave `DATABASE_URL` empty to use local storage.
- Set `DATABASE_URL` to use MongoDB/PostgreSQL.

## Configuration
### 1) `config.json`
Main runtime config for owner, pairing, limits, timeout, anti-spam, and behavior toggles.

Example:
```json
{
  "owner": "6283191036249",
  "owner_name": "Contact Support",
  "database": "data",
  "limit": 10,
  "ram_limit": "1GB",
  "timeout": 1800000,
  "spam": {
    "mode": "command",
    "limit": 4,
    "time_window": 5,
    "time_ban": 1800,
    "max_ban": 3,
    "cooldown": 5
  },
  "pairing": {
    "state": true,
    "number": 6283175395970,
    "code": "MOONXBOT"
  }
}
```

Important fields:
- `owner`: bot owner number without `+`.
- `database`: local database filename.
- `pairing.state`: enable/disable pairing mode.
- `pairing.number`: WhatsApp number used for login.
- `spam.*`: anti-spam configuration.

### 2) `lib/system/config.js`
Defines global header/footer, status messages, and API helper initialization:

```js
global.creator = '@naando.io - moon.bot'
global.Api = AlyaApi(process.env.API_ENDPOINT, process.env.API_KEY)
global.header = `moon-bot v${require('package.json').version}`
```

## Running the Bot
### Default mode
```bash
npm start
```

### Server mode (health endpoint)
```bash
npm run server
```

### PM2 mode
```bash
npm run pm2
```
Or:
```bash
pm2 start pm2.config.js
pm2 logs moon-bot
```

## Runtime Flow
- `index.js`: process bootstrap and auto-restart supervisor.
- `main.js`: WhatsApp connection, database boot, autosave, scheduled backup, listeners.
- `handler.js`: command/event validation, permission checks, anti-spam, plugin execution.

## Plugin Structure
Moon Bot supports two plugin types: command and event.

### Command plugin example
```js
module.exports = {
  help: ['feature'],
  aliases: ['fitur'],
  tags: 'miscs',
  run: async (m, { conn, plugins, Func }) => {
    conn.reply(
      m.chat,
      Func.texted('bold', `Total features available : [ ${Func.formatNumber(plugins.size)} ]`),
      m
    )
  },
  error: false
}
```

### Event plugin example
```js
module.exports = {
  run: async (m, { conn, body, isAdmin, isBotAdmin, groupSet }) => {
    if (groupSet.antilink && !isAdmin && isBotAdmin && body?.match(/chat.whatsapp.com|wa.me/gi)) {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.sender
        }
      })
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }
  },
  group: true,
  botAdmin: true,
  error: false
}
```

## Common Plugin Metadata
- `help`: command list.
- `aliases`: command aliases.
- `tags`: category (`miscs`, `tools`, `downloader`, etc.).
- `owner`, `premium`, `group`, `admin`, `botAdmin`, `private`, `register`: access guards.
- `limit`: user limit usage per command.
- `error`: if `true`, command is disabled.

## Handler Context
### Command context
```js
plugin.run(m, {
  ctx, conn, store, body, usedPrefix: prefix, plugins, commands, args, command, text,
  prefixes, core, isCommand, database, env, groupSet, chats, users, setting,
  isOwner, isPrem, groupMetadata, participants, isAdmin, isBotAdmin, Func, Scraper
})
```

### Event context
```js
event.run(m, {
  ctx, conn, store, body, plugins, prefixes, core, isCommand, database, env,
  groupSet, chats, users, setting, isOwner, isPrem, groupMetadata, participants,
  isAdmin, isBotAdmin, Func, Scraper
})
```

## Sending Messages
The snippets below follow real patterns used in built-in plugins.

### 1) Quick reply + reaction
```js
await conn.sendReact(m.chat, '🕒', m.key)
await conn.reply(m.chat, 'Processing...', m)
```

### 2) Rich message with thumbnail
```js
let caption = `乂  *U S E R - P R O F I L E*\n\n`
caption += `◦  *Name* : ${target.name}\n`
caption += `◦  *Limit* : ${Func.formatNumber(target.limit)}\n\n`
caption += global.footer

await conn.sendMessageModify(m.chat, caption, m, {
  largeThumb: true,
  thumbnail: pic, // URL or buffer
  url: setting.link // optional
})
```

### 3) Send media file or document
```js
await conn.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
  document: true,
  APIC: await Func.fetchBuffer(json.thumbnail) // audio/document cover art
})
```

### 4) Send sticker with pack metadata
```js
const media = await q.download()
await conn.sendSticker(m.chat, media, m, {
  packname: setting.sk_pack,
  author: setting.sk_author
})
```

### 5) Send contact card
```js
await conn.sendContact(
  m.chat,
  [{ name: 'Contact Support', number: env.owner, about: 'Owner & Creator' }],
  m,
  {
    org: 'Moon Support',
    website: 'https://api.alyachan.dev',
    email: 'contact@moonx.my.id'
  }
)
```

### 6) Structured snippet (table/code/file)
```js
await conn.metaSnippet(m.chat, {
  text: 'Product List',
  table: {
    headers: ['Product', 'Price', 'Stock'],
    rows: [
      ['VPS 1GB', '15000', '12'],
      ['VPS 2GB', '25000', '7']
    ]
  }
}, m)

await conn.metaSnippet(m.chat, {
  text: 'Example Code JavaScript:',
  code: "const hello = 'world'\\nconsole.log(hello)"
}, m)
```

## Production Tips
- Use PM2 for process supervision.
- Use `DATABASE_URL` for external persistent database.
- Enable `setting.autobackup` for scheduled owner backups.
- Keep memory aligned with `ram_limit` to avoid frequent restarts.

## Community
- WhatsApp group: <https://chat.whatsapp.com/GfBgnkz1lAs7NUk7lnzCDk>
