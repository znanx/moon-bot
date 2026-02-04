module.exports = {
   help: ['facebook'],
   aliases: ['fb'],
   use: 'link',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://www.facebook.com/share/r/1WCkXg8fsT/')
         if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) throw status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/fb', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         const result = json.data.find(v => v.quality == 'HD') || json.data.find(v => v.quality == 'SD')
         if (result && json.data.length == 1) {
            conn.sendFile(m.chat, result.url, Func.filename(result.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${result.quality}`, m)
         } else if (json.data.length > 1) {
            const album = json.data.map(v => ({ url: v.url }))
            conn.sendAlbumMessage(m.chat, album, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}