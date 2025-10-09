const { createHash } = require('crypto')
const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

module.exports = {
   help: ['reg'],
   aliases: ['register'],
   use: 'name.age',
   tags: 'user',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         const users = global.db.users[m.sender]
         if (users.registered === true) throw Func.texted('bold', '🚩 You are already registered in the bot database.')
         if (!Reg.test(text)) throw Func.example(usedPrefix, command, 'moon.17')
         let [_, name, splitter, age] = text.match(Reg)
         if (!name) throw Func.texted('bold', '🚩 Enter your name')
         if (!age) throw Func.texted('bold', '🚩 Enter your age')
         age = parseInt(age)
         if (name.length > 20) throw Func.texted('bold', '🚩 Name is too long')
         if (age > 80) throw Func.texted('bold', '🚩 Age is too old')
         if (age < 5) throw Func.texted('bold', '🚩 Too young, can babies type?')
         let sn = createHash('md5').update(m.sender).digest('hex')
         let txt = `*Registered successfully*

∘ Name : ${name}
∘ Age : ${age} years old
∘ SN : ${sn}
           
+ 100 Limit
+ 20.000 EXP`
         conn.reply(m.chat, txt, m).then(() => {
            users.name = name.trim()
            users.age = age
            users.reg_time = +new Date()
            users.registered = true
            users.limit += 100
            users.exp += 20000
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   private: true,
   error: false
}