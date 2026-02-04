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
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://v.douyin.com/ieWfMQA1/')
         if (!args[0].match('douyin.com')) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/downloader/douyin', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         const result = json.data.find(v => v.type == 'video')
         if (!result) {
            json.data.map(x => {
               conn.sendFile(m.chat, x.url, Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            })
         } else {
            conn.sendFile(m.chat, result.url, Func.filename('mp4'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}