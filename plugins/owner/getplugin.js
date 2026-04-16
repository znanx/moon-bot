const fs = require('fs')
const path = require('path')

module.exports = {
   help: ['getplugin'],
   use: 'plugin_name.js',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'menu.js'), m)

         const pluginsDir = path.resolve(process.cwd(), 'plugins')
         const filePath = path.resolve(pluginsDir, text)

         if (!fs.existsSync(filePath)) return conn.reply(m.chat, `🚩 Plugin file or directory '${text}' not found in the 'plugins' folder.`, m)

         if (fs.lstatSync(filePath).isDirectory()) {
            const list = fs.readdirSync(filePath).map(v => '  ' + v).join('\n')
            return conn.reply(m.chat, `📂 Directory listing for *plugins/${text}*:\n\n${list}`, m)
         }

         const content = fs.readFileSync(filePath, 'utf-8')
         if (content.length > 4000) {
            return conn.sendFile(m.chat, fs.readFileSync(filePath), path.basename(filePath), `plugins/${text}`, m)
         } else {
            return conn.metaSnippet(m.chat, {
               text: `*plugins/${text}*:`,
               code: {
                  file: filePath
               }
            }, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,
   error: false
}
