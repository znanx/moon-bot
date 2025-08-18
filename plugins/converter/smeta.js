module.exports = {
   help: ['smeta'],
   use: 'query / reply media',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply sticker.`), m)
         var stiker = false
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to the sticker you want to make into a meta sticker.`), m)
         let img = await q.download()
         if (!img) return conn.reply(m.chat, global.status.wrong, m)
         stiker = await addExif(img, packname || setting.sk_pack, author || setting.sk_author)
      } catch (e) {
         console.error(e)
         if (Buffer.isBuffer(e)) stiker = e
      } finally {
         if (stiker) conn.sendMessage(m.chat, {
            sticker: stiker
         }, {
            quoted: m
         })
         else return conn.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
      }
   },
   limit: true,
   error: false
}

const { Image } = require('node-webpmux')
async function addExif(buffer, packname, author, categories = [''], extra = {}) {
   const img = new Image()
   const json = {
      'sticker-pack-id': packname || 'Sticker By',
      'sticker-pack-name': author || 'moon-bot',
      'sticker-pack-publisher': global.creator || '@naando.io',
      'emojis': categories,
      'is-avatar-sticker': 1,
      ...extra
   }
   let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
   let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
   let exif = Buffer.concat([exifAttr, jsonBuffer])
   exif.writeUIntLE(jsonBuffer.length, 14, 4)
   await img.load(buffer)
   img.exif = exif
   return await img.save(null)
}