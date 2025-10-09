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
      participants,
      Func
   }) => {
      try {
         if (m.quoted) {
            if (m.quoted.isBot) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't make the bot a premium user.`), m)
            if (!args[0]) return conn.reply(m.chat, Func.texted('bold', `🚩 Time must be provided. Format: 30m / 2h / 7d`), m)
            if (!/^(\d+)([mhd])?$/.test(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid duration format.`), m)
            const durationMs = parseTime(args[0])
            const jid = conn.decodeJid(m.quoted.sender)
            const users = global.db.users[jid]
            users.limit += 1000
            users.expired += users.premium ? durationMs : (Date.now() + durationMs)
            conn.reply(m.chat, users.premium ? Func.texted('bold', `🚩 Successfully added ${args[0]} premium to @${jid.replace(/@.+/, '')}.`) : Func.texted('bold', `🚩 Successfully added @${jid.replace(/@.+/, '')} to premium user.`), m).then(() => users.premium = true)
         } else if (m.mentionedJid.length !== 0) {
            if (!args[1]) return conn.reply(m.chat, Func.texted('bold', `🚩 Time must be provided. Format: 30m / 2h / 7d`), m)
            if (!/^(\d+)([mhd])$/.test(args[1])) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid duration format.`), m)

            const durationMs = parseTime(args[1])
            const mention = m.mentionedJid[0]
            const isLid = mention.endsWith('@lid')

            const target = participants.find(p =>
               isLid ? p.lid === mention : p.id === mention
            )

            if (!target) return conn.reply(m.chat, Func.texted('bold', `🚩 Mentioned user not found in this group.`), m)

            const jid = target.id
            const user = global.db.users[jid]
            if (!user) return conn.reply(m.chat, Func.texted('bold', `🚩 User data not found.`), m)

            user.limit += 1000
            user.expired += user.premium ? durationMs : (Date.now() + durationMs)

            const replyText = user.premium ? `🚩 Successfully added ${args[1]} premium to @${jid.replace(/@.+/, '')}.` : `🚩 Successfully added @${jid.replace(/@.+/, '')} to premium user.`
            conn.reply(m.chat, Func.texted('bold', replyText), m).then(() => {
               user.premium = true
            })
         } else if (text && /\|/.test(text)) {
            let [number, rawDuration] = text.split`|`
            if (!rawDuration || !/^(\d+)([mhd])$/.test(rawDuration.trim())) return conn.reply(m.chat, Func.texted('bold', `🚩 Time must be valid. Format: 30m / 2h / 7d`), m)
            const durationMs = parseTime(rawDuration.trim())
            let p = (await conn.onWhatsApp(number.trim()))[0] || {}
            if (!p.exists) return conn.reply(m.chat, Func.texted('bold', `🚩 Number not registered on WhatsApp.`), m)
            const jid = conn.decodeJid(p.jid)
            const users = global.db.users[jid]
            if (!users) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't find user data.`), m)
            users.limit += 1000
            users.expired += users.premium ? durationMs : (Date.now() + durationMs)
            conn.reply(m.chat, Func.texted('bold', `🚩 Successfully updated premium for @${jid.replace(/@.+/, '')} (${rawDuration.trim()})`), m).then(() => users.premium = true)
         } else {
            let teks = `• *Example* :\n\n`
            teks += `${usedPrefix + command} 6285xxxxx | 7\n`
            teks += `${usedPrefix + command} @0 7\n`
            teks += `${usedPrefix + command} 7 (reply chat target)`
            conn.reply(m.chat, teks, m)
         }
      } catch (e) {
         console.error(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}

function parseTime(input = '30d') {
   const match = input.toLowerCase().match(/^(\d+)([mhd])?$/)
   if (!match) return 0
   const [, num, unit] = match
   const ms = {
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000
   }
   return parseInt(num) * (ms[unit] || ms.d) // default to day
}