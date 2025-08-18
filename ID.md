## Yang di butuhkan

- [x] Server vCPU/RAM 1/1GB ( Minimal )
- [x] NodeJS
- [x] Ffmpeg
- [x] Nomor WhatsApp 
- [x] Apikey AlyaChan API

## Server

- [x] [Heroku](https://heroku.com/)
- [x] VPS/RDP [DigitalOcean](https://digitalocean.com/)
- [x] VPS NAT [HostData](https://hostdata.id/) ( Rekomendasi )
- [x] Panel [Optiklink](https://optiklink.com/)

## Database

- [x] [MongoDB](https://mongodb.com) ( Rekomendasi )
- [x] PostgreSQL [Supebase](https://supebase.com)
- [x] PostgreSQL / MongoDB [Railway](https://railway.app) (For testing)

## Grup / Komunitas

- [x] [Grup WhatsApp](https://chat.whatsapp.com/GfBgnkz1lAs7NUk7lnzCDk)

## Konfigurasi

Ada 3 file yang dapat diubah:

[.env](/.env)
```.env
# Apikey 
API_ENDPOINT = 'https://api.alyachan.dev/api'
API_KEY = 'yourkey'

# Database URI
DATABASE_URL = ''
```

[config.json](/config.json)
```json
{
   "owner": "6285179886349",
   "owner_name": "Contact Support",
   "database": "data",
   "limit": "10",
   "multiplier": "250",
   "min_reward": 100000,
   "max_reward": 500000,
   "ram_limit": "1GB",
   "max_upload": 100,
   "max_upload_free": 50,
   "timer": 180000,
   "timeout": 1800000,
   "spam": {
      "mode": "command",
      "limit": 5,
      "time_window": 5,
      "time_ban": 30,
      "max_ban": 3,
      "cooldown": 5
   },
   "blocks": ["994", "221", "263", "212"],
   "evaluate_chars": ["=>", ">", "$", "~>", "!", "+", "/", "#", "."],
   "pairing": {
      "state": true,
      "number": 6283866857978
   }
}
```

[config.js](/lib/system/config.js)
```javascript
global.creator = '@naando.io - moon.bot'
global.Api = AlyaApi
global.header = `moon-bot v${require('../../package.json').version}`
global.footer = Func.Styles('simple whatsapp bot made by moon')
```

## Instalasi

Langsung
```bash
$ npm install
$ node .
```

PM2
```bash
$ npm i pm2 -g
$ npm install
$ pm2 start index.js
$ pm2 logs
```

## Struktur Plugin

Command
```javascript
module.exports = {
   help: ['feature'],
   aliases: ['fitur'],
   tags: 'miscs',
   run: async (m, {
      conn,
      plugins,
      Func
   }) => {
      conn.reply(m.chat, Func.texted('bold', 'Total features available : [ ' + Func.formatNumber(plugins.size) + ' ]'), m)
   },
   error: false
}
```

Event
```javascript
module.exports = {
   run: async (m, {
      conn,
      body,
      isAdmin,
      isBotAdmin,
      groupSet
   }) => {
      if (groupSet.antilink && !isAdmin && body) {
         if (body.match(/(chat.whatsapp.com)/gi) && !body.includes(await conn.groupInviteCode(m.chat)) || body.match(/(wa.me)/gi)) return conn.sendMessage(m.chat, {
            delete: {
               remoteJid: m.chat,
               fromMe: false,
               id: m.key.id,
               participant: m.sender
            }
         }).then(() => conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
      }
   },
   group: true,
   isBotAdmin: true,
   error: false
}
```

Command Handler Context
```javascript
plugin.run(m, { ctx, conn, store, body, usedPrefix: prefix, plugins, plugFiles, commands, args, command, text, prefixes, core, isCommand, database, env, groupSet, chats, users, setting, isOwner, isPrem, groupMetadata, participants, isAdmin, isBotAdmin, blockList, Func, Scraper })
```

Event Handler Context
```javascript
event.run(m, { ctx, conn, store, body, plugins, plugFiles, prefixes, core, isCommand, database, env, groupSet, chats, users, setting, isOwner, isPrem, groupMetadata, participants, isAdmin, isBotAdmin, blockList, Func, Scraper })
```

## Mengirim Pesan

```javascript
conn.reply(jid, 'Test!', quoted)

conn.sendContact(jid, [{
   name: 'Lorem Ipsum',
   number: '6281xxx',
   about: 'Owner & Creator'
}], quoted, {
   org: 'Moon Support',
   website: 'https://api.alyachan.dev',
   email: 'contact@moonx.my.id'
})

conn.sendMessageModify(jid, 'Test!', quoted, {
   largeThumb: true,
   thumbnail: 'https://i.ibb.co/GBsZR7j/image.jpg'
})

conn.sendFile(jid, url, filename, 'Test!', quoted)
```