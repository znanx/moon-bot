# Dokumentasi Moon Bot (ID)
Dokumen ini menjelaskan setup, konfigurasi, dan pengembangan plugin untuk Moon Bot.

- Kembali ke root: [`README.md`](../README.md)
- Dokumen English: [`EN.md`](./EN.md)

## Prasyarat
- Node.js `>= 22.x`
- FFmpeg
- ImageMagick
- WebP
- Nomor WhatsApp aktif
- API key Alya API untuk fitur berbasis API

## Rekomendasi Hosting
- VPS/RDP (misal DigitalOcean)
- VPS NAT (misal HostData)
- Panel hosting Node.js
- Railway/Supabase/MongoDB Atlas untuk database cloud

## Instalasi Cepat
```bash
git clone https://github.com/znanx/moon-bot.git
cd moon-bot
npm install
```

Buat file `.env` di root project:

```env
API_ENDPOINT='https://api.alyachan.dev/api'
API_KEY='your_api_key'
DATABASE_URL=''
TZ='Asia/Jakarta'
```

Catatan:
- Kosongkan `DATABASE_URL` jika ingin pakai penyimpanan lokal.
- Isi `DATABASE_URL` jika ingin pakai MongoDB/PostgreSQL.

## Konfigurasi
### 1) `config.json`
File utama untuk owner, pairing, limit, timeout, anti-spam, dan pengaturan runtime.

Contoh:
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

Field penting:
- `owner`: nomor owner bot tanpa `+`.
- `database`: nama file database lokal.
- `pairing.state`: aktif/nonaktif pairing mode.
- `pairing.number`: nomor WhatsApp untuk login.
- `spam.*`: aturan anti-spam.

### 2) `lib/system/config.js`
Mengatur global header/footer, object status, dan inisialisasi API helper:

```js
global.creator = '@naando.io - moon.bot'
global.Api = AlyaApi(process.env.API_ENDPOINT, process.env.API_KEY)
global.header = `moon-bot v${require('package.json').version}`
```

## Menjalankan Bot
### Mode default
```bash
npm start
```

### Mode server (health endpoint)
```bash
npm run server
```

### PM2
```bash
npm run pm2
```
Atau:
```bash
pm2 start pm2.config.js
pm2 logs moon-bot
```

## Alur Runtime Singkat
- `index.js`: bootstrap process + auto-restart ketika child process gagal.
- `main.js`: koneksi WhatsApp, load database, autosave, backup berkala, setup listener.
- `handler.js`: validasi command/event, role check, anti-spam, eksekusi plugin.

## Struktur Plugin
Moon Bot mendukung dua tipe plugin: command dan event.

### Contoh plugin command
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

### Contoh plugin event
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

## Metadata Plugin yang Umum
- `help`: daftar command.
- `aliases`: alias command.
- `tags`: kategori command (miscs, tools, downloader, dsb).
- `owner`, `premium`, `group`, `admin`, `botAdmin`, `private`, `register`: guard akses.
- `limit`: konsumsi limit user.
- `error`: jika `true`, command tidak bisa dipakai.

## Context Handler
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

## Contoh Kirim Pesan
Contoh di bawah mengikuti pola yang dipakai di plugin bawaan.

### 1) Reply cepat + reaction
```js
await conn.sendReact(m.chat, '🕒', m.key)
await conn.reply(m.chat, 'Sedang diproses...', m)
```

### 2) Rich message dengan thumbnail
```js
let caption = `乂  *U S E R - P R O F I L E*\n\n`
caption += `◦  *Name* : ${target.name}\n`
caption += `◦  *Limit* : ${Func.formatNumber(target.limit)}\n\n`
caption += global.footer

await conn.sendMessageModify(m.chat, caption, m, {
  largeThumb: true,
  thumbnail: pic, // URL atau buffer
  url: setting.link // opsional
})
```

### 3) Kirim file media atau dokumen
```js
await conn.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
  document: true,
  APIC: await Func.fetchBuffer(json.thumbnail) // cover audio/document
})
```

### 4) Kirim stiker dengan exif pack/author
```js
const media = await q.download()
await conn.sendSticker(m.chat, media, m, {
  packname: setting.sk_pack,
  author: setting.sk_author
})
```

### 5) Kirim kontak
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

### 6) Format snippet (table/code/file)
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

## Tips Produksi
- Aktifkan PM2 untuk auto-restart proses.
- Gunakan `DATABASE_URL` untuk database eksternal.
- Aktifkan `setting.autobackup` jika ingin backup berkala ke owner.
- Pastikan memori sesuai `ram_limit` agar tidak restart berulang.

## Komunitas
- Grup WhatsApp: <https://chat.whatsapp.com/GfBgnkz1lAs7NUk7lnzCDk>
