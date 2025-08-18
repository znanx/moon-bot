module.exports = {
   help: ['changename'],
   use: 'text',
   tags: 'owner',
   run: async (m, {
      conn,
      text,
      usedPrefix,
      command,
      database,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon bot'), m)
         if (text.length > 25) return conn.reply(m.chat, `🚩 Text is too long, maximum 25 characters.`, m)
         conn.authState.creds.me.name = text
         await database.save(global.db)
         return conn.reply(m.chat, `🚩 Name successfully changed.`, m)
      } catch {
         return conn.reply(m.chat, Func.texted('bold', `🚩 Name failed to change.`), m)
      }
   },
   owner: true,
   error: false
}