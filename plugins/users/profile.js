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

      let pic = await Promise.race([
         conn.profilePictureUrl(user, 'image'),
         new Promise(resolve => setTimeout(() => resolve(null), 1200))
      ]).catch(() => null)

      if (!pic || typeof pic !== 'string') {
         pic = await Func.fetchBuffer('./src/image/default.jpg')
      }

      const now = Date.now()

      let txt = `乂  *U S E R - P R O F I L E*\n\n`
      txt += `   ◦  *Name* : ${target.name}\n`
      txt += `   ◦  *Exp* : ${Func.formatNumber(target.exp)}\n`
      txt += `   ◦  *Limit* : ${Func.formatNumber(target.limit)}\n`
      txt += `   ◦  *Age* : ${target.age}\n`
      txt += `   ◦  *Hitstat* : ${Func.formatNumber(target.hit)}\n`
      txt += `   ◦  *Warning* : ${m.isGroup ? `${global.db.groups[m.chat].member[user]?.warning || 0} / 5` : `${target.warning} / 5`}\n\n`
      txt += `乂  *U S E R - S T A T U S*\n\n`
      txt += `   ◦  *Blocked* : ${blockList.includes(user) ? '√' : '×'}\n`
      txt += `   ◦  *Banned* : ${(now - target.ban_temporary < env.timer) ? Func.toTime(target.ban_temporary + env.timeout - now) + ` (${env.timeout / 60000} min)` : (target.banned ? '√' : '×')}\n`
      txt += `   ◦  *Last Seen* : ${target.lastseen === 0 ? 'Never' : Func.toDate(now - target.lastseen)}\n`
      txt += `   ◦  *Use Bot* : ${target.usebot === 0 ? 'Never' : Func.toDate(now - target.usebot)}\n`
      txt += `   ◦  *Use In Private* : ${Object.keys(global.db.chats).includes(user) ? '√' : '×'}\n`
      txt += `   ◦  *Premium* : ${target.premium ? '√' : '×'}\n`
      txt += `   ◦  *Expired* : ${target.expired === 0 ? '-' : Func.timeReverse(target.expired - now)}\n`
      txt += `   ◦  *Registered* : ${target.registered ? '√' : '×'}\n\n`
      txt += global.footer

      conn.sendLinkPreview(m.chat, txt, m, {
         ratio: 'potrait', // landscape (default), potrait, square */
         thumbnail: pic
      })
   },
   group: false,
   admin: false,
   botAdmin: false
}