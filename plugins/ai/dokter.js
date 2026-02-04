module.exports = {
   help: ['dokter'],
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
         if (!text) throw Func.example(usedPrefix, command, 'masuk angin')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/doctor', {
            prompt: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data.content, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
}