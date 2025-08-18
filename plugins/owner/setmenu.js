module.exports = {
   help: ['setmenu'],
   use: '(option)',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      setting,
      Func
   }) => {
      try {
         if (!args || !args[0]) return m.reply(Func.example(usedPrefix, command, '2'))
         if (!['1', '2'].includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Style not available.`), m)
         conn.reply(m.chat, `🚩 Bot menu successfully set using style *${args[0]}*.`, m).then(() => setting.style = parseInt(args[0]))
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}