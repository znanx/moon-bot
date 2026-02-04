module.exports = {
   help: ['instagram'],
   aliases: ['ig'],
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
         if (!args || !args[0]) throw Func.example(usedPrefix, command, 'https://www.instagram.com/p/CK0tLXyAzEI')
         if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) throw global.status.invalid
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/ig', {
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