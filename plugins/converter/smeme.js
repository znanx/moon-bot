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
         if (!text) throw Func.example(usedPrefix, command, 'Hi | Dude')
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
            } else throw Func.texted('bold', `🚩 Media is not supported, can only be pictures and stickers.`)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) throw Func.texted('bold', `🚩 Reply photo.`)
            if (!/webp|image\/(jpe?g|png)/.test(mime)) throw Func.texted('bold', `🚩 Media is not supported, can only be pictures and stickers.`)
            const image = await (await Scraper.uploader(await q.download())).data.url
            const json = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${image}`
            conn.sendSticker(m.chat, json, m, {
               packname: setting.sk_pack,
               author: setting.sk_author
            })
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}