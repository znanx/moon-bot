module.exports = {
   help: ['pin'],
   aliases: ['pinterest'],
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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'red moon'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/pinterest', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let old = new Date()
         let medias = []
         for (let i = 0; i < 5; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            medias.push({
               url: json.data[rand].url
            })
         }
         conn.sendAlbumMessage(m.chat, medias, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}