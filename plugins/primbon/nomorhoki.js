module.exports = {
   help: ['nomorhoki'],
   use: 'query',
   tags: 'primbon',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'moon')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/primbon/nomorhoki', { q: text })
         if (!json.status) throw Func.jsonFormat(json)
         m.reply(Func.jsonFormat(json.data))
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: true
}