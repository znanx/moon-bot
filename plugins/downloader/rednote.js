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
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://xhslink.com/a/hlM81D1Yoa63'), m)
         if (!args[0].match('xhslink.com')) return conn.reply(m.chat, global.status.invalid, m)
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/rednote', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         json.data.map(async (v, i) => {
            conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${(new Date() - old) * 1} ms`, m)
            await Func.delay(1500)
         })
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}