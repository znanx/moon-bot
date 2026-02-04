module.exports = {
   help: ['paretro', 'retrolga', 'plumy', 'hdr', 'sepia', 'duotone', 'blackwhite', 'sketch', 'sketchril', 'oils', 'esragan', 'watercolor', 'galaxy', 'freplace', 'rainbow', 'solarize', 'pinkbir'],
   use: 'reply photo',
   tags: 'image effect',
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
               let old = new Date()
               const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
               if (!cdn.status) throw Func.jsonFormat(cdn)
               const json = await Api.get('/effect/image', {
                  image_url: cdn.data.url, style: command
               })
               if (!json.status) throw Func.jsonFormat(json)
               conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
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
            const json = await Api.get('/effect/image', {
               image_url: cdn.data.url, style: command
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}