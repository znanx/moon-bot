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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'mark itu orang atau alien'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/qwen', {
            msg: text,
            model: 'qwen-max-latest',
            realtime: true
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data.choices[0].message.content, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}