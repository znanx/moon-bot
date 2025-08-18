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
         if (!args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
         if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return conn.reply(m.chat, global.status.invalid, m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ytv', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let txt = `乂  *Y T - M P 4*\n\n`
         txt += `   ◦  *Title* : ${json.title}\n`
         txt += `   ◦  *Duration* : ${json.duration}\n`
         txt += `   ◦  *Views* : ${json.views}\n`
         txt += `   ◦  *Size* : ${json.data.size}\n\n`
         txt += global.footer
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m)
         conn.sendFile(m.chat, json.data.url, json.data.filename, txt, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}