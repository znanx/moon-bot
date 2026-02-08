module.exports = {
   help: ['promptgen'],
   use: 'query',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'white cat')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/generator/prompt', {
            prompt: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data[0].content.parts[0].text, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
}