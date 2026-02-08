module.exports = {
   help: ['article'],
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
         if (!text) throw Func.example(usedPrefix, command, 'hujan | Indonesian')
         let [teks, iso] = text.split` | `
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/generator/article', {
            text: teks, lang: iso
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data.content, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   premium: true,
   error: false
}