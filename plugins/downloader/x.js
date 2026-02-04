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
         const json = await Api.get('/downloader/x', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         if (json.data.length == 1) {
            conn.sendFile(m.chat, json.data[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         } else {
            const album = json.data.map(v => ({ url: v.url }))
            conn.sendAlbumMessage(m.chat, album, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}