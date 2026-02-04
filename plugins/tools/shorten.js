module.exports = {
   help: ['shortner'],
   aliases: ['shortlink', 'shorten'],
   use: 'link',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Scraper,
      Func
   }) => {
      try {
         if (!args[0]) throw Func.example(usedPrefix, command, 'http://google.com')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/tools/shorten', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, json.data.url, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}