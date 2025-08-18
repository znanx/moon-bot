module.exports = {
   run: async (m, {
      conn,
      groupSet,
      isAdmin,
      Func
   }) => {
      try {
         if (groupSet.antitagsw && !isAdmin && /groupStatusMentionMessage/.test(m.mtype)) return conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove').then(() => conn.sendMessage(m.chat, {
            delete: {
               remoteJid: m.chat,
               fromMe: false,
               id: m.key.id,
               participant: m.sender
            }
         }))
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   botAdmin: true,
   error: false
}