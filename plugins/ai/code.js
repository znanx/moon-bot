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
         if (!text) throw Func.example(usedPrefix, command, 'How to create delay function | js')
         let [code, act] = text.split` | `
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/generator/code', {
            prompt: code, action: act
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data.code, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}