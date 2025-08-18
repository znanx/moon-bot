module.exports = {
   help: ['+prem'],
   aliases: ['addprem'],
   use: 'mention or reply',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      text,
      env,
      Func
   }) => {
      if (m.quoted) {
         if (m.quoted.isBot) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't make the bot a premium user.`), m)
         if (args && isNaN(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Day must be a number.`), m)
         let days = args[0] ? parseInt(args[0]) : 30
         let jid = conn.decodeJid(m.quoted.sender)
         let users = global.db.users[jid]
         users.expired += users.premium ? (86400000 * days) : ((new Date() * 1) + (86400000 * days))
         users.limit += 2000
         conn.reply(m.chat, users.premium ? Func.texted('bold', `🚩 Succesfully added ${days} days premium access for @${jid.replace(/@.+/, '')}.`) : Func.texted('bold', `🚩 Successfully added @${jid.replace(/@.+/, '')} to premium user.`), m).then(() => users.premium = true)
      } else if (m.mentionedJid.length != 0) {
         if (args && args[1] && isNaN(args[1])) return conn.reply(m.chat, Func.texted('bold', `🚩 Day must be a number.`), m)
         let days = args[1] ? parseInt(args[1]) : 30
         let jid = conn.decodeJid(m.mentionedJid[0])
         const users = global.db.users[jid]
         users.expired += users.premium ? (86400000 * days) : ((new Date() * 1) + (86400000 * days))
         users.limit += 2000
         conn.reply(m.chat, users.premium ? Func.texted('bold', `🚩 Succesfully added ${days} days premium access for @${jid.replace(/@.+/, '')}.`) : Func.texted('bold', `🚩 Successfully added @${jid.replace(/@.+/, '')} to premium user.`), m).then(() => users.premium = true)
      } else if (text && /|/.test(text)) {
         let [number, day] = text.split`|`
         let p = (await conn.onWhatsApp(number))[0] || {}
         if (!p.exists) return conn.reply(m.chat, Func.texted('bold', '🚩 Number not registered on WhatsApp.'), m)
         if (isNaN(day)) return conn.reply(m.chat, Func.texted('bold', `🚩 Day must be a number.`), m)
         let days = day ? parseInt(day) : 30
         let jid = conn.decodeJid(p.jid)
         const users = global.db.users[jid]
         if (!users) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't find user data.`), m)
         users.expired += users.premium ? (86400000 * days) : ((new Date() * 1) + (86400000 * days))
         users.limit += 2000
         conn.reply(m.chat, users.premium ? Func.texted('bold', `🚩 Succesfully added ${days} days premium access for @${jid.replace(/@.+/, '')}.`) : Func.texted('bold', `🚩 Successfully added @${jid.replace(/@.+/, '')} to premium user.`), m).then(() => users.premium = true)
      } else {
         let teks = `• *Example* :\n\n`
         teks += `${usedPrefix + command} 6285xxxxx | 7\n`
         teks += `${usedPrefix + command} @0 7\n`
         teks += `${usedPrefix + command} 7 (reply chat target)`
         conn.reply(m.chat, teks, m)
      }
   },
   owner: true
}