module.exports = {
   help: ['hidetag'],
   use: 'text',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      let txt = m.quoted ? m.quoted.text : text 
      let users = participants.map(v => v.id)
      await conn.reply(m.chat, txt, null, {
         mentions: users
      })
   },
   group: true,
   admin: true,
   error: false
}