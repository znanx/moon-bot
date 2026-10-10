const { Converter } = require('@znan/wabot')

module.exports = {
   help: ['upswgc'],
   use: 'text / reply media',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         if (/video|image\/(jpe?g|png)/.test(mime)) {
            conn.sendReact(m.chat, '🕒', m.key)
            const buffer = await q.download()
            const type = /video/.test(mime) ? 'video' : 'image'
            const { status } = await conn.storiesGroup(m.chat, {
               [type]: buffer,
               caption: text || ''
            })
            if (status === true) return conn.sendReact(m.chat, '✅', m.key)
            throw Func.texted('bold', `🚩 Gagal mengunggah story grup.`)
         } else if (/audio/.test(mime)) {
            conn.sendReact(m.chat, '🕒', m.key)
            const buffer = await q.download()
            const ext = (mime.split('/')[1] || 'mp3').split(';')[0]
            const audio = /ogg/.test(mime) ? buffer : await Converter.toPTT(buffer, ext)
            const { status } = await conn.storiesGroup(m.chat, {
               audio,
               ptt: true
            })
            if (status === true) return conn.sendReact(m.chat, '✅', m.key)
            throw Func.texted('bold', `🚩 Gagal mengunggah story grup.`)
         } else if (text) {
            conn.sendReact(m.chat, '🕒', m.key)
            const { status } = await conn.storiesGroup(m.chat, text, {
               backgroundColor: Func.random(['#1E90FF', '#00BFFF', '#0099FF', '#3399FF', '#3AB0FF']),
               font: Func.random([1, 2, 3, 4, 5])
            })
            if (status === true) return conn.sendReact(m.chat, '✅', m.key)
            throw Func.texted('bold', `🚩 Gagal mengunggah story grup.`)
         } else throw Func.texted('bold', `🚩 Kirim teks atau balas media (gambar, video, audio) untuk mengunggah story grup.`)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   group: true,
   admin: true,
   botAdmin: true,
   limit: false,
   error: false
}
