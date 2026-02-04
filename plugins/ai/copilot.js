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
         if (!text) throw Func.example(usedPrefix, command, 'apa itu kucing')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/copilot', {
            prompt: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data.content, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}