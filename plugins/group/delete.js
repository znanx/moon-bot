module.exports = {
   help: ['delete'],
   aliases: ['del', 'd'],
   use: 'reply chat',
   tags: 'group',
   run: async (m, {
      conn,
      isBotAdmin
   }) => {
      if (!m.quoted) return
      conn.sendMessage(m.chat, {
         delete: {
            remoteJid: m.chat,
            fromMe: isBotAdmin ? false : true,
            id: m.quoted.id,
            participant: m.quoted.sender
         }
      })
   },
   group: true,
   error: false
}