module.exports = {
   help: ['code'],
   use: 'query | lang',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'How to create delay function | js'))
         let [code, act] = text.split` | `
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai-code', {
            text: code, action: act
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data.code, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}