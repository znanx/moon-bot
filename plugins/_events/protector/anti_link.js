module.exports = {
   run: async (m, {
      conn,
      body,
      isAdmin,
      isBotAdmin,
      groupSet
   }) => {
      if (groupSet.antilink && !isAdmin && body) {
         if (body.match(/(chat.whatsapp.com)/gi) && !body.includes(await conn.groupInviteCode(m.chat)) || body.match(/(wa.me)/gi)) return conn.sendMessage(m.chat, {
            delete: {
               remoteJid: m.chat,
               fromMe: false,
               id: m.key.id,
               participant: m.sender
            }
         }).then(() => conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
      }
   },
   group: true,
   isBotAdmin: true,
   error: false
}