module.exports = {
   help: ['mathsolver'],
   aliases: ['mathresolver'],
   use: 'expression',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, '1 + 1'))
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai-mathsolver', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data.answer, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}