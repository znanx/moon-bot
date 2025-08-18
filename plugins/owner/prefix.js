module.exports = {
   help: ['+prefix', '-prefix'],
   use: 'symbol',
   tags: 'owner',
   run: async (m, {
      conn,
      args,
      usedPrefix,
      command,
      Func,
      env
   }) => {
      let system = global.db.setting
      if (command == '+prefix') {
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, '#'), m)
         if (env.evaluate_chars.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Cannot add prefix ${args[0]} because an error will occur.`), m)
         if (system.prefix.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Prefix ${args[0]} already exists in the database.`), m)
         system.prefix.push(args[0])
         conn.reply(m.chat, Func.texted('bold', `🚩 Prefix ${args[0]} successfully added.`), m)
      } else if (command == '-prefix') {
         if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, '#'), m)
         if (system.prefix.length < 2) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't removing more prefix.`), m)
         if (!system.prefix.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Prefix ${args[0]} not exists in the database.`), m)
         system.prefix.forEach((data, index) => {
            if (data === args[0]) system.prefix.splice(index, 1)
         })
         conn.reply(m.chat, Func.texted('bold', `🚩 Prefix ${args[0]} successfully removed.`), m)
      }
   },
   owner: true
}