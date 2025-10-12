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
         if (!text) throw Func.example(usedPrefix, command, 'red moon')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/pinterest', {
            q: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         let medias = []
         for (let i = 0; i < 5; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            medias.push({
               url: json.data[rand].url
            })
         }
         conn.sendAlbumMessage(m.chat, medias, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}