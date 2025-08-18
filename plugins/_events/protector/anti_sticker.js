module.exports = {
   run: async(m, {
      conn,
      body,
      isOwner,
      groupSet,
      setting,
      isBotAdmin,
      Func
   }) => {
      if (m.isGroup && groupSet.antisticker && /stickerMessage/.test(m.mtype)) {
         conn.sendMessage(m.chat, {
            delete: {
               remoteJid: m.chat,
               fromMe: isBotAdmin ? false : true,
               id: m.key.id,
               participant: m.sender
            }
         })
      }
   },
   error: false,
   group: true,
   error: false
}