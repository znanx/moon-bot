module.exports = {
   help: ['age'],
   use: 'reply photo',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Scraper,
      Func
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               conn.sendReact(m.chat, '🕒', m.key)
               let img = await conn.downloadMediaMessage(q)
               let image = await Scraper.uploader(img)
               const json = await Api.get('/face-detect', {
                  image: image.data.url
               })
               if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
               conn.reply(m.chat, `Gender : ${json.data.gender}\nAge : ${json.data.age}`, m)
            } else conn.reply(m.chat, 'Only for photo.', m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, `Reply photo with command ${usedPrefix + command}.`, m)
            if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, 'Only for photo.', m)
            conn.sendReact(m.chat, '🕒', m.key)
            let img = await q.download()
            let image = await Scraper.uploader(img)
            const json = await Api.get('/face-detect', {
               image: image.data.url
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.reply(m.chat, `Gender : ${json.data.gender}\nAge : ${json.data.age}`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true
}