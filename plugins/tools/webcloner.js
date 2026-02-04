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
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://google.com')
         if (!/^https?:\/\//.test(args[0])) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/tools/webcloner', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}