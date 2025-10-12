module.exports = {
   help: ['ytmp3'],
   aliases: ['yta'],
   use: 'link',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      users,
      env,
      Func
   }) => {
      try {
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://youtu.be/zaRFmdtLhQ8')
         if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/yta', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         let txt = `乂  *Y T - M P 3*\n\n`
         txt += `   ◦  *Title* : ${json.title}\n`
         txt += `   ◦  *Size* : ${json.data.size}\n`
         txt += `   ◦  *Duration* : ${json.duration}\n`
         txt += `   ◦  *Size* : ${json.data.size}\n\n`
         txt += global.footer
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) throw isOver
         conn.sendMessageModify(m.chat, txt, m, {
            largeThumb: true,
            thumbnail: json.thumbnail
         }).then(async () => {
            conn.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
               document: true,
               APIC: await Func.fetchBuffer(json.thumbnail)
            })
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}