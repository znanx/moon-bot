module.exports = {
   help: ['copilot'],
   use: 'query',
   tags: 'ai',
   run: async (m, {
      conn,
      text,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'apa itu kucing'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai-copilot', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data.content, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}