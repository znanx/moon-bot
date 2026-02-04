module.exports = {
   help: ['wallpaper'],
   use: 'query',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'sunset')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/searching/wallpaper', {
            q: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         const medias = Array.from({ length: 5 }, () => {
            const rand = Math.floor(Math.random() * json.data.length)
            return { url: json.data[rand].url }
         })
         if (medias.length === 1) {
            conn.sendFile(m.chat, medias[0].url, '', '', m)
         } else {
            conn.sendAlbumMessage(m.chat, medias, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}