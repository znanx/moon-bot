module.exports = {
   help: ['terabox'],
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
         if (!args || !args[0]) throw Func.example(usedPrefix, command, 'https://terabox.com/s/1jDTI6wLo066ALCYQ69sDyA')
         if (!args[0].match(/(?:https?:\/\/(www\.)?terabox\.(com|app)\S+)?$/)) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/terabox', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) throw isOver
         conn.sendFile(m.chat, json.data.url, json.data.filename, '', m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}