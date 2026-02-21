module.exports = {
   help: ['ytmp4'],
   aliases: ['ytv'],
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
         const json = await Api.get('/youtube', {
            url: args[0], type: 'mp4'
         })
         if (!json.status) throw Func.jsonFormat(json)
         let txt = `乂  *Y T - M P 4*\n\n`
         txt += `   ◦  *Title* : ${json.data.title}\n`
         txt += `   ◦  *Duration* : ${json.data.duration}\n`
         txt += `   ◦  *Views* : ${json.data.views}\n`
         txt += `   ◦  *Size* : ${json.data.size}\n\n`
         txt += global.footer
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) throw isOver
         conn.sendFile(m.chat, json.data.url, json.data.filename, txt, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}