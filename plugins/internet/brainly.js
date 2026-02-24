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
         if (!text) throw Func.example(usedPrefix, command, 'Penemu listrik')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/searching/brainly', {
            q: text, language: 'id'
         })
         if (!json.status) throw Func.jsonFormat(json)
         let txt = `乂  *B R A I N L Y*\n\n`
         json.data.result.map((v, i) => {
            txt += `*${(i + 1)}*. ${v.question}\n`
            txt += `◦  *Answer* : \n${v.answers}\n\n`
         })
         conn.reply(m.chat, txt + global.footer, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}