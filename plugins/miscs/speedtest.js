const cp = require('child_process')
const { promisify } = require('util')
const exec = promisify(cp.exec).bind(cp)

module.exports = {
   help: ['speedtest'],
   aliases: ['speed'],
   tags: 'miscs',
   run: async (m, {
      conn,
      Func
   }) => {
      conn.reply(m.chat, Func.texted('bold', 'Testing speed...'), m)
      let o
      try {
         o = await exec('python speed.py --share --secure')
      } catch (e) {
         o = e
      } finally {
         let { stdout, stderr } = o
         if (stdout.trim()) {
            if (stdout.includes('http')) {
               const imageUrl = stdout.match(/http[^\s]+/)[0]
               conn.sendFile(m.chat, imageUrl, '', stdout, m)
            } else {
               m.reply(stdout)
            }
         }
         if (stderr.trim()) m.reply(stderr)
      }
   },
   error: false
}