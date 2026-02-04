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
               const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
               if (!cdn.status) throw Func.jsonFormat(cdn)
               const json = await Api.get('/tools/removebg', {
                  image_url: cdn.data.url
               })
               if (!json.status) throw Func.jsonFormat(json)
               conn.sendSticker(m.chat, json.data.url, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else throw Func.texted('bold', `🚩 Only for photo.`)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) throw Func.texted('bold', `🚩 Reply photo.`)
            if (!/image\/(jpe?g|png)/.test(mime)) throw Func.texted('bold', `🚩 Only for photo.`)
            conn.sendReact(m.chat, '🕒', m.key)
            const cdn = await Scraper.uploader(await q.download())
            if (!cdn.status) throw Func.jsonFormat(cdn)
            const json = await Api.get('/tools/removebg', {
               image_url: cdn.data.url
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.sendSticker(m.chat, json.data.url, m, {
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