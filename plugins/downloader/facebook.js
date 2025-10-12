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
         const json = await Api.get('/fb', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         const result = json.data.find(v => v.quality == 'HD') || json.data.find(v => v.quality == 'SD')
         if (result) {
            conn.sendFile(m.chat, result.url, Func.filename(result.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${result.quality}`, m)
         } else {
            json.data.map(async v => {
               await conn.sendFile(m.chat, v.url, Func.filename(v.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${v.quality}`, m)
               await Func.delay(1500)
            })
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}