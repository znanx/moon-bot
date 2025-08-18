module.exports = {
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      let id = m.chat
      conn.math = conn.math ? conn.math : {}
      if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0
      if (m.quoted && /What is the result of/i.test(m.quoted.text)) {
         if (!(id in conn.math) && /What is the result of/i.test(m.quoted.text)) return conn.reply(m.chat, '🚩 The question has ended.', m)
         let math = JSON.parse(JSON.stringify(conn.math[id][1]))
         if (m.text == math.result) {
            users.exp += math.bonus
            clearTimeout(conn.math[id][3])
            delete conn.math[id]
            m.react('✅').then(() => m.reply(`*+${math.bonus}* EXP`))
         } else {
            if (--conn.math[id][2] == 0) {
               clearTimeout(conn.math[id][3])
               delete conn.math[id]
               conn.reply(m.chat, `🚩 The opportunity is gone!`, m)
            } else m.react('❌')
         }
      }
   },
   group: true,
   error: false
}