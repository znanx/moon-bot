module.exports = {
   help: ['x'],
   aliases: ['twitter'],
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
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://twitter.com/gofoodindonesia/status/1229369819511709697'))
         if (!args[0].match(/(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/(\d+)/)) return conn.reply(m.chat, global.status.invalid, m)
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/twitter', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         const url = json.data.find((v) => v.url).url
         conn.sendFile(m.chat, url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}