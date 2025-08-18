module.exports = {
   help: ['douyin'],
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
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://v.douyin.com/ieWfMQA1/'), m)
         if (!args[0].match('douyin.com')) return conn.reply(m.chat, global.status.invalid, m)
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/douyin', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         const result = json.data.find(v => v.type == 'video')
         if (!result) {
            json.data.map(x => {
               conn.sendFile(m.chat, x.url, Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            })
         } else {
            conn.sendFile(m.chat, result.url, Func.filename('mp4'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}