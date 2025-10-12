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
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://twitter.com/gofoodindonesia/status/1229369819511709697')
         if (!args[0].match(/(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/(\d+)/)) throw global.status.invalid
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/twitter', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         const url = json.data.find((v) => v.url).url
         conn.sendFile(m.chat, url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}