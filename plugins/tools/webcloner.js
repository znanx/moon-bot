module.exports = {
   help: ['webcloner'],
   use: 'link',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://google.com'), m)
         if (!/^https?:\/\//.test(args[0])) return conn.reply(m.chat, global.status.invalid, m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/web-cloner', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   limit: true,
   premium: true
}