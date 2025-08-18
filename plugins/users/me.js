module.exports = {
   help: ['me'],
   tags: 'user',
   run: async (m, {
      conn,
      usedPrefix,
      blockList,
      env,
      Func
   }) => {
      let user = global.db.users[m.sender]
      let _own = [...new Set([env.owner, ...global.db.setting.owners])]
      let pic = await conn.profilePictureUrl(m.sender, 'image') || await Func.fetchBuffer('./src/image/default.jpg')
      let blocked = blockList.includes(m.sender) ? true : false
      let now = new Date() * 1
      let lastseen = (user.lastseen == 0) ? 'Never' : Func.toDate(now - user.lastseen)
      let usebot = (user.usebot == 0) ? 'Never' : Func.toDate(now - user.usebot)
      let txt = `乂  *U S E R - P R O F I L E*\n\n`
      txt += `   ◦  *Name* : ${m.pushName}\n`
      txt += `   ◦  *Exp* : ${Func.formatNumber(user.exp)}\n`
      txt += `   ◦  *Limit* : ${Func.formatNumber(user.limit)}\n`
      txt += `   ◦  *Hitstat* : ${Func.formatNumber(user.hit)}\n`
      txt += `   ◦  *Warning* : ${((m.isGroup) ? (typeof global.db.groups[m.chat].member[m.sender] != 'undefined' ? global.db.groups[m.chat].member[m.sender].warning : 0) + ' / 5' : user.warning + ' / 5')}\n\n`
      txt += `乂  *U S E R - S T A T U S*\n\n`
      txt += `   ◦  *Blocked* : ${(blocked ? '√' : '×')}\n`
      txt += `   ◦  *Banned* : ${(new Date - user.ban_temporary < env.timer) ? Func.toTime(new Date(user.ban_temporary + env.timeout) - new Date()) + ' (' + ((env.timeout / 1000) / 60) + ' min)' : user.banned ? '√' : '×'}\n`
      txt += `   ◦  *Use In Private* : ${(Object.keys(global.db.chats).includes(m.sender) ? '√' : '×')}\n`
      txt += `   ◦  *Premium* : ${(user.premium ? '√' : '×')}\n`
      txt += `   ◦  *Expired* : ${user.expired == 0 ? '-' : Func.timeReverse(user.expired - new Date() * 1)}\n\n`
      txt += global.footer
      conn.sendMessageModify(m.chat, txt, m, {
         largeThumb: true,
         thumbnail: pic
      })
   },
   error: false
}