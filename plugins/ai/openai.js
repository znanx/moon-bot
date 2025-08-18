module.exports = {
   help: ['openai'],
   aliases: ['ai'],
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
         if (!text) return m.reply(Func.example(usedPrefix, command, 'moonbot'))
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/openai', {
            prompt: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data.content, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}
