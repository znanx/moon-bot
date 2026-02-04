module.exports = {
   help: ['rednote'],
   use: 'link',
   tags: 'downloader',
   run: async (m, {
      conn,
      args,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         if (!args || !args[0]) throw Func.example(usedPrefix, command, 'https://xhslink.com/a/hlM81D1Yoa63')
         if (!args[0].match('xhslink.com')) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/downloader/rednote', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         json.data.map(async (v, i) => {
            conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${(new Date() - old) * 1} ms`, m)
            await Func.delay(1500)
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}