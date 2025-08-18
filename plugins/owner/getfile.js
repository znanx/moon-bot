const fs = require('fs')
const path = require('path')

module.exports = {
   help: ['getfile'],
   aliases: ['gf', 'gp'],
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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'plugins/menu.js'), m)
         const filePath = path.resolve(process.cwd(), text)
         if (!fs.existsSync(filePath)) return conn.reply(m.chat, `🚩 File '${text}' not found.`, m)
         if (fs.lstatSync(filePath).isDirectory()) {
            const list = fs.readdirSync(filePath).map(v => '  ' + v).join('\n')
            return conn.reply(m.chat, `📂 Directory listing for *${text}*:\n\n${list}`, m)
         }
         const content = fs.readFileSync(filePath, 'utf-8')
         if (content.length > 4000) {
            return conn.sendMessage(m.chat, {
               document: fs.readFileSync(filePath),
               fileName: path.basename(filePath),
               mimetype: 'text/plain'
            }, { quoted: m })
         } else {
            return conn.reply(m.chat, content, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,
   error: false
}