const { writeFileSync, readFileSync } = require('fs')
module.exports = {
   help: ['backup'],
   tags: 'owner',
   run: async (m, {
      conn,
      database,
      env,
      Func
   }) => {
      try {
         conn.sendReact(m.chat, '🕒', m.key)
         await database.save(global.db)
         writeFileSync(env.database + '.json', JSON.stringify(global.db, null, 3), 'utf-8')
         await conn.sendFile(m.chat, readFileSync('./' + env.database + '.json'), env.database + '.json', '', m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}