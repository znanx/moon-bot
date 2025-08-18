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
         if (!text) return m.reply(Func.example(usedPrefix, command, 'hujan | Indonesian'))
         let [teks, iso] = text.split` | `
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai-article', {
            text: teks, lang: iso
         })
         if (!json.status) return conn.reply(m.chat, json.msg, m)
         conn.reply(m.chat, json.data.content, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true,
   error: false
}