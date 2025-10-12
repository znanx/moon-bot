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
         const json = await Api.get('/ig', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         for (let i of json.data) {
            conn.sendFile(m.chat, i.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(1500)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}