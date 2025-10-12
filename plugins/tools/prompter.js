module.exports = {
   help: ['prompter'],
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
               let old = new Date()
               const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
               if (!cdn.status) throw Func.jsonFormat(cdn)
               const json = await Api.get('/prompter', {
                  image: cdn.data.url
               })
               if (!json.status) throw Func.jsonFormat(json)
               let result = json.data[0].content.parts[0].text
               conn.reply(m.chat, Func.jsonFormat(result), m)
            } else throw Func.texted('bold', `🚩 Only for photo.`)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) throw Func.texted('bold', `🚩 Reply photo.`)
            if (!/image\/(jpe?g|png)/.test(mime)) throw Func.texted('bold', `🚩 Only for photo.`)
            conn.sendReact(m.chat, '🕒', m.key)
            let old = new Date()
            const cdn = await Scraper.uploader(await q.download())
            if (!cdn.status) throw Func.jsonFormat(cdn)
            const json = await Api.get('/prompter', {
               image: cdn.data.url
            })
            if (!json.status) throw Func.jsonFormat(json)
            let result = json.data[0].content.parts[0].text
            conn.reply(m.chat, Func.jsonFormat(result), m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   premium: true,
}