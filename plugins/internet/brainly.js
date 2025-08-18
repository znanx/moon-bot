module.exports = {
   help: ['brainly'],
   use: 'query',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'Penemu listrik'))
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/brainly', {
            q: text, lang: 'id'
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let teks = `乂  *B R A I N L Y*\n\n`
         json.data.map((v, i) => {
            teks += `*${(i + 1)}*. ${v.question}\n`
            teks += `◦  *Answer* : \n${v.answers}\n\n`
         })
         conn.reply(m.chat, teks + global.footer, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}