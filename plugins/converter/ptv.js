module.exports = {
   help: ['toptv'],
   aliases: ['ptv'],
   use: 'reply video',
   tags: 'converter',
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         if (!/video/.test(mime)) throw Func.texted('bold', '🚩 Balas video yang mau dijadikan PTV!')
         const seconds = q.seconds || q.msg?.seconds || 0
         if (seconds > 60) throw Func.texted('bold', '🚩 Durasi maksimal video adalah 60 detik.')
         conn.sendReact(m.chat, '🕒', m.key)

         const buffer = await q.download()
         return conn.sendPtv(m.chat, buffer, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 1,
   error: false
}
