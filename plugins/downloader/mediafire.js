const axios = require('axios')
module.exports = {
   help: ['mediafire'],
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
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://www.mediafire.com/file/c2fyjyrfckwgkum/ZETSv1%25282%2529.zip/file'), m)
         if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) return conn.reply(m.chat, global.status.invalid, m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/mediafire', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m)
         await conn.sendFile(m.chat, json.data.url, json.data.filename, '', m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}