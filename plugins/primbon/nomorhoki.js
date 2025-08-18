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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/nomorhoki', { q: text })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         m.reply(Func.jsonFormat(json.data))
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}