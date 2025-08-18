const { Mongo, Postgre } = new (require('@znan/wabot'))
const env = require('../../config.json')
const database = /mongo/.test(process.env.DATABASE_URL) ? new Mongo(process.env.DATABASE_URL, env.database) : /postgres/.test(process.env.DATABASE_URL) ? new Postgre(process.env.DATABASE_URL, env.database) : new (require('../../lib/system/localdb'))(env.database)
module.exports = {
   help: ['restart'],
   tags: 'owner',
   run: async (m, {
      conn,
      Func
   }) => {
      await conn.reply(m.chat, Func.texted('bold', 'Restarting . . .'), m).then(async () => {
         await database.save(global.db)
         process.send('reset')
      })
   },
   owner: true
}