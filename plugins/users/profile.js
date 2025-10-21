module.exports = {
   help: ['profile'],
   use: 'mention or reply',
   tags: 'user',
   run: async (m, {
      conn,
      text,
      env,
      participants,
      Func
   }) => {
      let input = m?.mentionedJid?.[0] || m?.quoted?.sender || text
      if (!input) return conn.reply(m.chat, Func.texted('bold', `🚩 Mention or Reply chat target.`), m)

      let user = input
      if (input.includes('@lid')) {
         const participant = participants.find(p => p.lid === input)
         if (!participant) return conn.reply(m.chat, Func.texted('bold', `🚩 Cannot find user in group.`), m)
         user = participant.id
      } else if (!input.includes('@s.whatsapp.net')) {
         const wa = await conn.onWhatsApp(input.trim())
         if (!wa.length) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
         user = conn.decodeJid(wa[0].jid)
      }

      let blockList = []
      try {
         blockList = await conn.fetchBlocklist() || []
      } catch { }

      const target = global.db.users[user]
      if (!target) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't find user data.`), m)
      const pic = await conn.profilePictureUrl(user, 'image').catch(() => Func.fetchBuffer('./src/image/default.jpg'))
      const now = Date.now()

      let caption = `乂  *U S E R - P R O F I L E*\n\n`
      caption += `   ◦  *Name* : ${target.name}\n`
      caption += `   ◦  *Exp* : ${Func.formatNumber(target.exp)}\n`
      caption += `   ◦  *Limit* : ${Func.formatNumber(target.limit)}\n`
      caption += `   ◦  *Age* : ${target.age}\n`
      caption += `   ◦  *Hitstat* : ${Func.formatNumber(target.hit)}\n`
      caption += `   ◦  *Warning* : ${m.isGroup ? `${global.db.groups[m.chat].member[user]?.warning || 0} / 5` : `${target.warning} / 5`}\n\n`
      caption += `乂  *U S E R - S T A T U S*\n\n`
      caption += `   ◦  *Blocked* : ${blockList.includes(user) ? '√' : '×'}\n`
      caption += `   ◦  *Banned* : ${(now - target.ban_temporary < env.timer) ? Func.toTime(target.ban_temporary + env.timeout - now) + ` (${env.timeout / 60000} min)` : (target.banned ? '√' : '×')}\n`
      caption += `   ◦  *Last Seen* : ${target.lastseen === 0 ? 'Never' : Func.toDate(now - target.lastseen)}\n`
      caption += `   ◦  *Use Bot* : ${target.usebot === 0 ? 'Never' : Func.toDate(now - target.usebot)}\n`
      caption += `   ◦  *Use In Private* : ${Object.keys(global.db.chats).includes(user) ? '√' : '×'}\n`
      caption += `   ◦  *Premium* : ${target.premium ? '√' : '×'}\n`
      caption += `   ◦  *Expired* : ${target.expired === 0 ? '-' : Func.timeReverse(target.expired - now)}\n`
      caption += `   ◦  *Registered* : ${target.registered ? '√' : '×'}\n\n`
      caption += global.footer

      await conn.sendMessageModify(m.chat, caption, m, {
         largeThumb: true,
         thumbnail: pic
      })
   },
   group: false,
   admin: false,
   botAdmin: false
}