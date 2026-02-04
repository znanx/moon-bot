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
         if (!args || !args[0]) throw Func.example(usedPrefix, command, 'https://www.mediafire.com/file/c2fyjyrfckwgkum/ZETSv1%25282%2529.zip/file')
         if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/mediafire', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) throw isOver
         await conn.sendFile(m.chat, json.data.url, json.data.filename, '', m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}