const fs = require('fs')
const path = require('path')

module.exports = {
   help: ['savefile'],
   aliases: ['sf'],
   use: 'path/to/file.js',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'miscs/ping.js'), m)
         if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', '🚩 Reply to messages/files containing code.'), m)
         const filePath = path.resolve(process.cwd(), text)
         const dir = path.dirname(filePath)
         if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
         }
         if (m.quoted.mimetype) {
            const buff = await m.quoted.download()
            fs.writeFileSync(filePath, buff)
            conn.reply(m.chat, `✅ The document file has been successfully saved :\n*${text}*`, m)
         } else if (m.quoted.text) {
            fs.writeFileSync(filePath, m.quoted.text, 'utf-8')
            conn.reply(m.chat, `✅ Code successfully saved :\n*${text}*`, m)
         } else {
            conn.reply(m.chat, '🚩 Reply with text or document files!', m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,
   error: false
}