const { execSync } = require('child_process')

module.exports = {
   help: ['update'],
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         var stdout = execSync('git pull')
         var output = stdout.toString()
         if (output.match(new RegExp('Already up to date', 'g'))) return conn.reply(m.chat, Func.texted('bold', `🚩 ${output.trim()}`), m)
         if (output.match(/stash/g)) {
            var stdout = execSync('git stash && git pull')
            var output = stdout.toString()
            conn.reply(m.chat, `🚩 ${output.trim()}`, m).then(async () => process.send('reset'))
         } else return conn.reply(m.chat, `🚩 ${output.trim()}`, m).then(async () => process.send('reset'))
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,
   error: false
}