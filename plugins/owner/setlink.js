module.exports = {
   help: ['setlink'],
   use: 'link',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         let setting = global.db.setting
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, global.db.setting.link), m)
         const isUrl = Func.isUrl(text)
         if (!isUrl) return conn.reply(m.chat, Func.texted('bold', `🚩 URL is invalid.`), m)
         setting.link = text
         conn.reply(m.chat, Func.texted('bold', `🚩 Link successfully set.`), m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}