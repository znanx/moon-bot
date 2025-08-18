module.exports = {
   help: ['+toxic', '-toxic'],
   use: 'word',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         if (command == '+toxic') {
            if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'fuck'), m)
            if (global.db.setting.toxic.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' already in the database.`), m)
            global.db.setting.toxic.push(args[0])
            global.db.setting.toxic.sort(function (a, b) {
               if (a < b) {
                  return -1;
               }
               if (a > b) {
                  return 1;
               }
               return 0
            })
            conn.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' added successfully!`), m)
         } else if (command == '-toxic') {
            if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'fuck'), m)
            if (global.db.setting.toxic.length < 2) return conn.reply(m.chat, Func.texted('bold', `🚩 Sorry, you can't remove more.`), m)
            if (!global.db.setting.toxic.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' not in database.`), m)
            global.db.setting.toxic.forEach((data, index) => {
               if (data === args[0]) global.db.setting.toxic.splice(index, 1)
            })
            conn.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' has been removed.`), m)
         }
      } catch (e) {
         return conn.reply(m.chat, global.status.error, m)
      }
   },
   owner: true
}