module.exports = {
   help: ['threads'],
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
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.threads.net/t/CuiXbGvPyJz/?igshid=NTc4MTIwNjQ2YQ=='))
         if (!/https?:\/\/(?:www\.)?(threads\.(net|com)|[\w-]+\.com)\/[^\s"]*/i.test(args[0])) return conn.reply(m.chat, global.status.invalid, m)
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/threads', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         for (let i of json.data) {
            conn.sendFile(m.chat, i.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}