module.exports = {
   help: ['totag'],
   use: 'reply chat',
   tags: 'admin',
   run: async (m, {
      conn,
      participants,
      Func
   }) => {
      if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', '🚩 Reply chat'), m)
      conn.sendMessage(m.chat, {
         forward: m.quoted.fakeObj,
         mentions: participants.map(v => v.id).filter(v => v !== conn.user.id)
      })
   },
   group: true,
   admin: true,
   error: false
}