const { createWriteStream, readFileSync } = require('fs')
const moment = require('moment-timezone')
const path = require('path')
const archiver = require('archiver')
const ignore = require('ignore')

module.exports = {
   help: ['backsupsc'],
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      const gitignorePath = path.join(__dirname, '../../.gitignore')
      const zipPath = path.join(__dirname, '../../tmp/backup.zip')
      try {
         const ig = ignore()
         const gitignoreContent = readFileSync(gitignorePath, 'utf-8')
         ig.add(gitignoreContent)
         conn.sendReact(m.chat, '🕒', m.key)
         const output = createWriteStream(zipPath)
         const archive = archiver('zip', { zlib: { level: 9 } })
         output.on('close', async () => {
            await conn.sendFile(m.chat, zipPath, `Backup Script - ${moment(new Date()).format('DD/MM/YY')}_${Date.now()}.zip`, `The backup is complete, with a file size of : ${await Func.getSize(archive.pointer())}`, m)
         })
         archive.on('error', (e) => {
            console.log(e)
            return conn.reply(m.chat, Func.jsonFormat(e), m)
         })
         archive.pipe(output)
         const rootDir = path.join(__dirname, '../../')
         const allFiles = require('glob').sync('**/*', {
            cwd: rootDir,
            dot: true,
         })
         for (const file of allFiles) {
            if (!ig.ignores(file)) {
               const filePath = path.join(rootDir, file)
               archive.file(filePath, { name: file })
            }
         }
         archive.finalize()
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,
   error: false
}