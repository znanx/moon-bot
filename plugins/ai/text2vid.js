module.exports = {
   help: ['txt2vid'],
   aliases: ['text2video'],
   use: 'prompt | model',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'cat'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let [prompt, model] = text.split` | `, old = new Date()
         const json = await Api.post('/text2vid', {
            prompt, model
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.output[0], '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: 3,
   premium: true,
   error: false
}