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
         if (!args[1]) throw Func.example(usedPrefix, command, 'mobile https://api.alyachan.dev')
         if (!/^https?:\/\//.test(args[1])) throw Func.texted('bold', '🚩 Prefix the link with https:// or http://')
         let old = new Date(), mode = args[0].toLowerCase(), url = args[1]
         if (!['mobile', 'desktop'].includes(mode)) throw Func.texted('bold', '🚩 Use mobile or desktop mode.')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/tools/screenshot', {
            url: url, mode: mode
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}