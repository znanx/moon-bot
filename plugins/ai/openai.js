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
         if (!text) throw Func.example(usedPrefix, command, 'moonbot')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/openai', {
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
