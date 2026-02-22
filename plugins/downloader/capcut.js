module.exports = {
   help: ['capcut'],
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
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://www.capcut.com/template-detail/7355407233057950983?template_id=7355407233057950983&share_token=2fbab1d5-37fa-42ab-a00f-9d181da79409&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1')
         if (!args[0].match('capcut.com')) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/capcut', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.url, Func.filename('mp4'), `◦ *Title* : ${json.data.title}\n◦ *Description* : ${json.data.description}`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}