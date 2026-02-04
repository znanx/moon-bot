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
         if (!/https?:\/\/(?:www\.)?(threads\.(net|com)|[\w-]+\.com)\/[^\s"]*/i.test(args[0])) throw global.status.invalid
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/threads', {
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