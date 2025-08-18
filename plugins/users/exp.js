module.exports = {
   help: ['exp'],
   tags: 'user',
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      if (users.exp < 1) return conn.reply(m.chat, `🚩 Your EXP on using bots is up.`, m)
      conn.reply(m.chat, Func.texted('bold', `🍉 EXP : [ ${Func.formatNumber(users.exp)} ]`), m)
   }
}