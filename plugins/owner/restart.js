module.exports = {
   help: ['restart'],
   tags: 'owner',
   run: async (m, {
      conn,
      database,
      Func
   }) => {
      await conn.reply(m.chat, Func.texted('bold', 'Restarting . . .'), m).then(async () => {
         await database.save(global.db)
         process.send('reset')
      })
   },
   owner: true
}