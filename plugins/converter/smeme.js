module.exports = {
   help: ['smeme'],
   use: 'text | text',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      setting,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Hi | Dude'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let [top, bottom] = text.split`|`
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image|webp/.test(type)) {
               let img = await conn.downloadMediaMessage(q)
               const image = await (await Scraper.uploader(img)).data.url
               const json = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${image}`
               conn.sendSticker(m.chat, json, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else return conn.reply(m.chat, Func.texted('bold', `🚩 Media is not supported, can only be pictures and stickers.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/webp|image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Media is not supported, can only be pictures and stickers.`), m)
            const image = await (await Scraper.uploader(await q.download())).data.url
            const json = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${image}`
            conn.sendSticker(m.chat, json, m, {
               packname: setting.sk_pack,
               author: setting.sk_author
            })
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}