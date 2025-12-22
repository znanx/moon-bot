const moment = require('moment-timezone')

module.exports = {
   help: ['groupinfo'],
   aliases: ['gcinfo', 'infogc'],
   tags: 'group',
   run: async (m, {
      conn,
      participants,
      groupMetadata,
      groupSet,
      Func
   }) => {
      const meta = groupMetadata
      const creator = (meta?.owner?.endsWith('lid') ? meta?.ownerPn || meta.ownerJid : meta.owner)?.replace(/@.+/, '')
      const admin = await conn.getAdmin(participants)
      const member = participants.map(v => v.id)
      let pic = await conn.profilePictureUrl(m.chat, 'image').catch(async () => await Func.fetchBuffer('./src/image/default.jpg'))
      let txt = `乂  *G R O U P - I N F O*\n\n`
      txt += `   ◦  *Name* : ${meta.subject}\n`
      txt += `   ◦  *Member* : ${member.length}\n`
      txt += `   ◦  *Admin* : ${admin.length}\n`
      txt += `   ◦  *Created* : ${moment(meta.creation * 1000).format('DD/MM/YY HH:mm:ss')}\n`
      txt += `   ◦  *Owner* : ${creator ? '@' + creator : '-'}\n\n`
      txt += `乂  *M O D E R A T I O N*\n\n`
      txt += `   ◦  ${Func.switcher(groupSet.antidelete, '[ √ ]', '[ × ]')} Anti Delete\n`
      txt += `   ◦  ${Func.switcher(groupSet.antilink, '[ √ ]', '[ × ]')} Anti Link\n`
      txt += `   ◦  ${Func.switcher(groupSet.antivirtex, '[ √ ]', '[ × ]')} Anti Virtex\n`
      txt += `   ◦  ${Func.switcher(groupSet.antisticker, '[ √ ]', '[ × ]')} Anti Sticker\n`
      txt += `   ◦  ${Func.switcher(groupSet.antiporn, '[ √ ]', '[ × ]')} Anti Porn\n`
      txt += `   ◦  ${Func.switcher(groupSet.antitoxic, '[ √ ]', '[ × ]')} Anti Toxic\n`
      txt += `   ◦  ${Func.switcher(groupSet.antibot, '[ √ ]', '[ × ]')} Anti Bot\n`
      txt += `   ◦  ${Func.switcher(groupSet.antitagsw, '[ √ ]', '[ × ]')} Anti Tag Status\n`
      txt += `   ◦  ${Func.switcher(groupSet.autosticker, '[ √ ]', '[ × ]')} Auto Sticker\n`
      txt += `   ◦  ${Func.switcher(groupSet.autodetect, '[ √ ]', '[ × ]')} Auto Detect\n`
      txt += `   ◦  ${Func.switcher(groupSet.autoclose?.active, '[ √ ]', '[ × ]')} Auto Close | ${groupSet.autoclose?.active ? `${groupSet.autoclose.start}-${groupSet.autoclose.end}` : 'Not Set'}\n`
      txt += `   ◦  ${Func.switcher(groupSet.welcome, '[ √ ]', '[ × ]')} Welcome Message\n`
      txt += `   ◦  ${Func.switcher(groupSet.left, '[ √ ]', '[ × ]')} Left Message\n\n`
      txt += `乂  *G R O U P - S T A T U S*\n\n`
      txt += `   ◦  *Mute* : ${Func.switcher(groupSet.mute, '√', '×')}\n`
      txt += `   ◦  *Stay* : ${Func.switcher(groupSet.stay, '√', '×')}\n`
      txt += `   ◦  *Expired* : ${groupSet.expired == 0 ? 'NOT SET' : Func.timeReverse(groupSet.expired - new Date * 1)}\n\n`
      txt += global.footer
      conn.sendMessageModify(m.chat, txt, m, {
         largeThumb: true,
         thumbnail: pic
      })
   },
   group: true
}