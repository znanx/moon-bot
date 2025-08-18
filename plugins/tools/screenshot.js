module.exports = {
   help: ['screenshot'],
   aliases: ['ss'],
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
         if (!args[1]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'mobile https://api.alyachan.dev'), m)
         if (!/^https?:\/\//.test(args[1])) return conn.reply(m.chat, Func.texted('bold', '🚩 Prefix the link with https:// or http://'), m)
         let old = new Date(), mode = args[0].toLowerCase(), url = args[1]
         if (!['mobile', 'desktop'].includes(mode)) return conn.reply(m.chat, Func.texted('bold', '🚩 Use mobile or desktop mode.'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ssweb', {
            url: url, mode: mode
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}