const { readFileSync } = require('fs')
module.exports = {
   help: ['restore'],
   tags: 'owner',
   run: async (m, {
      conn,
      command,
      database,
      env,
      Func
   }) => {
      try {
         if (m.quoted && /document/.test(m.quoted.mtype) && /json/.test(m.quoted.fileName)) {
            const fn = await Func.getFile(await m.quoted.download())
            if (!fn.status) return conn.reply(m.chat, Func.texted('bold', `🚩 File cannot be downloaded.`), m)
            global.db = JSON.parse(readFileSync(fn.file, 'utf-8'))
            conn.reply(m.chat, '✅ Database was successfully restored.', m).then(async () => {
               await database.save(JSON.parse(readFileSync(fn.file, 'utf-8')))
            })
         } else conn.reply(m.chat, Func.texted('bold', `🚩 Reply to the backup file first then reply with this feature.`), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}