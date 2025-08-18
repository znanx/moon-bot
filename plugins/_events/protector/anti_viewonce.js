module.exports = {
   run: async (m, {
      conn,
      body,
      isOwner,
      groupSet,
      Func
   }) => {
      try {
         if (m.msg && m.msg.viewOnce && !isOwner && groupSet.viewonce) {
            let media = await conn.downloadMediaMessage(m.msg)
            if (/image/.test(m.mtype)) {
               conn.sendFile(m.chat, media, Func.filename('jpg'), body ? body : '', m)
            } else if (/video/.test(m.mtype)) {
               conn.sendFile(m.chat, media, Func.filename('mp4'), body ? body : '', m)
            }
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   error: false
}