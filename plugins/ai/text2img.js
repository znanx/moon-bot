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
         if (!text) throw Func.example(usedPrefix, command, 'White cat | black | Text to Image | 1:1 | true')
         conn.sendReact(m.chat, '🕒', m.key)
         let [prompt, negative_prompt, model, ratio, upscale] = text.split` | `, old = new Date()
         const json = await Api.post('/ai/text2img', {
            prompt, negative_prompt, model, ratio, upscale
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.images[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 3,
   premium: true,
   error: false
}