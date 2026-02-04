module.exports = {
   help: ['mathsolver'],
   aliases: ['mathresolver'],
   use: 'expression',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, '1 + 1')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/mathsolver', {
            prompt: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data.answer, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}