module.exports = {
   help: ['+owner', '-owner', '-prem', 'block', 'unblock', 'ban', 'unban'],
   use: 'mention or reply',
   tags: 'owner',
   run: async (m, {
      conn,
      text,
      command,
      env,
      Func
   }) => {
      try {
         const input = m?.mentionedJid?.[0] || m?.quoted?.sender || text
         if (!input) return conn.reply(m.chat, Func.texted('bold', `🚩 Mention or reply chat target.`), m)
         const p = await conn.onWhatsApp(input.trim())
         if (!p.length) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
         const jid = conn.decodeJid(p[0].jid)
         const number = jid.replace(/@.+/, '')
         if (command == '+owner') { // add owner number
            let owners = global.db.setting.owners
            if (owners.includes(number)) return conn.reply(m.chat, Func.texted('bold', `🚩 Target is already the owner.`), m)
            owners.push(number)
            conn.reply(m.chat, Func.texted('bold', `🚩 Successfully added @${number} as owner.`), m)
         } else if (command == '-owner') { // remove owner number
            let owners = global.db.setting.owners
            if (!owners.includes(number)) return conn.reply(m.chat, Func.texted('bold', `🚩 Target is not owner.`), m)
            owners.forEach((data, index) => {
               if (data === number) owners.splice(index, 1)
            })
            conn.reply(m.chat, Func.texted('bold', `🚩 Successfully removing @${number} from owner list.`), m)
         } else if (command == '-prem') { // remove premium
            let data = global.db.users[jid]
            if (typeof data == 'undefined') return conn.reply(m.chat, Func.texted('bold', `🚩 Can't find user data.`), m)
            if (!data.premium) return conn.reply(m.chat, Func.texted('bold', `🚩 Not a premium account.`), m)
            data.limit = env.limit
            data.premium = false
            data.expired = 0
            conn.reply(m.chat, Func.texted('bold', `🚩 @${jid.replace(/@.+/, '')}'s premium status has been successfully deleted.`), m)
         } else if (command == 'block') { // block user
            if (jid == conn.decodeJid(conn.user.id)) return conn.reply(m.chat, Func.texted('bold', `🚩 ??`), m)
            conn.updateBlockStatus(jid, 'block').then(res => m.reply(Func.jsonFormat(res)))
         } else if (command == 'unblock') { // unblock user
            conn.updateBlockStatus(jid, 'unblock').then(res => m.reply(Func.jsonFormat(res)))
         } else if (command == 'ban') { // banned user
            let is_user = global.db.users
            let is_owner = [conn.decodeJid(conn.user.id).split`@`[0], env.owner, ...global.db.setting.owners].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(jid)
            if (!is_user.some(v => v.jid == jid)) return conn.reply(m.chat, Func.texted('bold', `🚩 User data not found.`), m)
            if (is_owner) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't banned owner number.`), m)
            if (jid == conn.decodeJid(conn.user.id)) return conn.reply(m.chat, Func.texted('bold', `🚩 ??`), m)
            if (is_user[jid].banned) return conn.reply(m.chat, Func.texted('bold', `🚩 Target already banned.`), m)
            is_user[jid].banned = true
            let banned = Object.values(is_user).filter(v => v.banned).length
            conn.reply(m.chat, `乂  *B A N N E D*\n\n*“Successfully added @${jid.split`@`[0]} into banned list.”*\n\n*Total : ${banned}*`, m)
         } else if (command == 'unban') { // unbanned user
            let is_user = global.db.users
            if (typeof is_user[jid] == 'undefined') return conn.reply(m.chat, Func.texted('bold', `🚩 User data not found.`), m)
            if (!typeof is_user[jid].banned) return conn.reply(m.chat, Func.texted('bold', `🚩 Target not banned.`), m)
            is_user[jid].banned = false
            let banned = Object.values(is_user).filter(v => v.banned).length
            conn.reply(m.chat, `乂  *U N B A N N E D*\n\n*“Succesfully removing @${jid.split`@`[0]} from banned list.”*\n\n*Total : ${banned}*`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   owner: true
}