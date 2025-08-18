module.exports = {
   help: ['snobg'],
   use: 'reply photo',
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
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               conn.sendReact(m.chat, '🕒', m.key)
               let img = await conn.downloadMediaMessage(q)
               let image = await (await Scraper.uploader(img)).data.url
               const json = await Api.get('/removebg', {
                  image: image
               })
               if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
               conn.sendSticker(m.chat, json.data.url, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const image = await (await Scraper.uploader(await q.download())).data.url
            const json = await Api.get('/removebg', {
               image: image
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.sendSticker(m.chat, json.data.url, m, {
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