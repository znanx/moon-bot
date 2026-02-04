module.exports = {
   help: ['photoexif'],
   use: 'reply photo',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      Scraper,
      Func
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               conn.sendReact(m.chat, '🕒', m.key)
               const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
               if (!cdn.status) throw Func.jsonFormat(cdn)
               const json = await Api.get('/tools/image-exif', {
                  image_url: cdn.data.url
               })
               if (!json.status) throw Func.jsonFormat(json)
               conn.reply(m.chat, Func.jsonFormat(json.data), m)
            } else throw Func.texted('bold', `🚩 Only for photo.`)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
            if (!cdn.status) throw Func.jsonFormat(await q.download())
            const json = await Api.get('/tools/image-exif', {
               image_url: cdn.data.url
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.reply(m.chat, Func.jsonFormat(json.data), m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   premium: true,
}