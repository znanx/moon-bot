module.exports = {
   help: ['qwen'],
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
         if (!text) throw Func.example(usedPrefix, command, 'mark itu orang atau alien')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/qwen', {
            prompt: text,
            model: 'qwen-max-latest',
            realtime: true
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data.choices[0].message.content, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
}