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
         if (!text) throw Func.example(usedPrefix, command, 'cat')
         conn.sendReact(m.chat, '🕒', m.key)
         let [prompt, model] = text.split` | `, old = new Date()
         const json = await Api.post('/ai/text2vid', {
            prompt, model
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.output[0], '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 3,
   premium: true,
   error: false
}