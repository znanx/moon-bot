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
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://www.facebook.com/share/r/1WCkXg8fsT/'), m)
         if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return conn.reply(m.chat, status.invalid, m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/fb', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
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
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}