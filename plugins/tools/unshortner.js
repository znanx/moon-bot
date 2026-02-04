module.exports = {
   help: ['unshortner'],
   aliases: ['unshort', 'unshortlink'],
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
         if (!args[0]) throw Func.example(usedPrefix, command, 'http://gg.gg/1brt6s')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/tools/unshortner', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, Func.jsonFormat(json.data), m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}