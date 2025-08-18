module.exports = {
   help: ['txt2img'],
   aliases: ['text2image', 'texttoimage', 'txttoimg'],
   use: 'prompt | negative | model | ratio',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'White cat | black | Text to Image | 1:1 | true'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let [prompt, negative_prompt, model, ratio, upscale] = text.split` | `, old = new Date()
         const json = await Api.post('/text2img', {
            prompt, negative_prompt, model, ratio, upscale
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.images[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: 3,
   premium: true,
   error: false
}