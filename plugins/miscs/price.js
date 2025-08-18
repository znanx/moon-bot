module.exports = {
   help: ['premium'],
   tags: 'miscs',
   run: async (m, {
      conn,
      usedPrefix
   }) => {
      conn.reply(m.chat, `IDR 10.000 ~ to get 30 Days premium & 2000 Limit`, m)
   }
}