module.exports = {
   help: ['setwelcome', 'setbye'],
   use: 'text',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      groupSet,
      Func
   }) => {
      if (command == 'setwelcome') {
         if (!text) return conn.reply(m.chat, formatWel(usedPrefix, command), m)
         groupSet.sWelcome = text
         await conn.reply(m.chat, Func.texted('bold', `🚩 Successfully set.`), m)
      } else if (/set(out|left)/i.test(command)) {
         if (!text) return conn.reply(m.chat, formatLef(usedPrefix, command), m)
         groupSet.sBye = text
         await conn.reply(m.chat, Func.texted('bold', `🚩 Successfully set.`), m)
      }
   },
   group: true,
   admin: true,
   error: false
}

const formatWel = (prefix, command) => {
   return `Sorry, can't return without text, and this explanation and how to use :

*1.* @tag : for mention new member on welcome message.
*2.* @subject : for getting group name.
*3.* @desc : for getting group description.

• *Example* : ${prefix + command} Hi +tag, welcome to +grup group, we hope you enjoyed with us.`
}

const formatLef = (prefix, command) => {
   return `Sorry, can't return without text, and this explanation and how to use :

*1.* @tag : for mention new member on left message.
*2.* @subject : for getting group name.

• *Example* : ${prefix + command} Good by +tag`
}