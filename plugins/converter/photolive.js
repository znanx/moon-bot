module.exports = {
   help: ['photolive'],
   use: 'reply video',
   tags: 'converter',
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      try {
         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         if (!/video/.test(mime)) throw Func.texted('bold', '🚩 Balas video yang mau dijadikan photo live!')
         const seconds = q.seconds || q.msg?.seconds || 0
         if (seconds > 10) throw Func.texted('bold', '🚩 Durasi maksimal video adalah 10 detik.')
         conn.sendReact(m.chat, '🕒', m.key)

         const buffer = await q.download()
         return conn.sendFile(m.chat, buffer, '', '', m, {
            photo_live: true
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 1,
   error: false
}
