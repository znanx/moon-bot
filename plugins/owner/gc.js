// https://github.com/neoxr/neoxr-bot/blob/5.0-ESM/plugins/owner/gc.js

module.exports = {
   help: ['gc', 'gcopt'],
   run: async (m, {
      conn,
      args,
      usedPrefix,
      command,
      setting,
      Func
   }) => {
      try {
         let groups = global.db.groups
         if (m.quoted && (m.quoted?.text)?.match(/gcopt/g) && (m.quoted.sender == conn.decodeJid(conn.user.id) || m.quoted.sender == conn.decodeJid(conn.user.lid))) {
            if (!args || !args[0]) return m.reply(Func.texted('bold', `🚩 Give the group number argument in order.`))
            if (isNaN(args[0])) return m.reply(Func.texted('bold', `🚩 This argument must be a number.`))
            const jids = (m.quoted.text).split('💳* :').length
            if (args[0] > (jids - 1) || args[0] < 1) return m.reply(Func.texted('bold', `🚩 An error occurred, please check the group data list again.`))
            const select = (args[0]).trim()
            const jid = ((m.quoted.text).split('💳* :')[select].split`\n`[0] + '@g.us').trim()
            const group = groups[jid]
            if (!group) return m.reply(Func.texted('bold', `🚩 Data group does not exist in the database.`))
            const groupMetadata = await (await conn.groupMetadata(jid))
            const groupName = groupMetadata ? groupMetadata.subject : ''
            const adminList = conn.getAdmin(conn.resolveLid(groupMetadata.participants))
            const admin = adminList.includes(conn.decodeJid(conn.user.id))
            const useOpt = (args && args[1]) ? true : false
            const option = useOpt ? (args[1]).toLowerCase() : false
            const time = group.stay ? 'FOREVER' : (group.expired == 0 ? 'NOT SET' : Func.timeReverse(group.expired - new Date() * 1))
            const member = groupMetadata.participants.map(u => u.id).length
            const pic = await conn.profilePictureUrl(jid, 'image').catch(async () => await Func.fetchBuffer('./src/image/default.jpg'))
            let data = {
               name: groupName,
               member,
               time,
               group,
               admin
            }
            if (!useOpt) return conn.sendMessageModify(m.chat, steal(Func, data) + '\n\n' + global.footer, m, {
               largeThumb: true,
               thumbnail: pic
            })
            if (option == 'open') {
               if (!admin) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't open ${groupName} group link because the bot is not an admin.`), m)
               conn.groupSettingUpdate(jid, 'not_announcement').then(() => {
                  conn.reply(jid, Func.texted('bold', `🚩 Group has been opened.`)).then(() => {
                     conn.reply(m.chat, Func.texted('bold', `🚩 Successfully open ${groupName} group.`), m)
                  })
               })
            } else if (option == 'close') {
               if (!admin) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't close ${groupName} group link because the bot is not an admin.`), m)
               conn.groupSettingUpdate(jid, 'announcement').then(() => {
                  conn.reply(jid, Func.texted('bold', `🚩 Group has been closed.`)).then(() => {
                     conn.reply(m.chat, Func.texted('bold', `🚩 Successfully close ${groupName} group.`), m)
                  })
               })
            } else if (option == 'mute') {
               group.mute = true
               conn.reply(m.chat, Func.texted('bold', `🚩 Bot successfully muted in ${groupName} group.`), m)
            } else if (option == 'unmute') {
               group.mute = false
               conn.reply(m.chat, Func.texted('bold', `🚩 Bot successfully unmuted in ${groupName} group.`), m)
            } else if (option == 'link') {
               if (!admin) return conn.reply(m.chat, Func.texted('bold', `🚩 Can't get ${groupName} group link because the bot is not an admin.`), m)
               conn.reply(m.chat, 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(jid)), m)
            } else if (option == 'leave') {
               conn.reply(jid, `🚩 Good Bye! (${setting.link})`, null, {
                  mentions: groupMetadata.participants.map(v => v.id)
               }).then(() => {
                  conn.groupLeave(jid).then(() => {
                     groups[jid].expired = 0
                     groups[jid].stay = false
                     return conn.reply(m.chat, Func.texted('bold', `🚩 Successfully leave from ${groupName} group.`), m)
                  })
               })
            } else if (option == 'reset') {
               groups[jid].expired = 0
               groups[jid].stay = false
               conn.reply(m.chat, Func.texted('bold', `🚩 Configuration of bot in the ${groupName} group has been successfully reseted to default.`), m)
            } else if (option == 'forever') {
               group.expired = 0
               group.stay = true
               conn.reply(m.chat, Func.texted('bold', `🚩 Successfully set bot to stay forever in ${groupName} group.`), m)
            } else if (/(d|h|m)/gi.test(option)) {
               let now = new Date() * 1
               let duration = 0
               if (/d/gi.test(option)) {
                  duration = 86400000 * parseInt(option.replace('d', ''))   // day
               } else if (/h/gi.test(option)) {
                  duration = 3600000 * parseInt(option.replace('h', ''))    // hour
               } else if (/m/gi.test(option)) {
                  duration = 60000 * parseInt(option.replace('m', ''))      // minute
               }
               group.expired += (group.expired == 0) ? (now + duration) : duration
               group.stay = false
               conn.reply(m.chat, Func.texted('bold', `🚩 Bot duration is successfully set to stay for ${option.replace('d', ' day').replace('m', ' minute').replace('h', ' hours')} in ${groupName} group.`), m)
            } else return m.reply(explain(usedPrefix, command))
         } else return m.reply(explain(usedPrefix, command))
      } catch (e) {
         console.log(e)
         m.reply(Func.jsonFormat(e))
      }
   },
   owner: true
}

const steal = (Func, data) => {
   return `乂  *S T E A L E R*

	◦  *Name* : ${data.name}
	◦  *Member* : ${data.member}
	◦  *Expired* : ${data.time}
	◦  *Status* : ${Func.switcher(data.group.mute, 'OFF', 'ON')}
	◦  *Bot Admin* : ${Func.switcher(data.admin, '√', '×')}`
}

const explain = (prefix, cmd) => {
   return `乂  *M O D E R A T I O N*

*1.* ${prefix + cmd} <no>
- to steal / get group info

*2.* ${prefix + cmd} <no> open
- to open the group allow all members to send messages

*3.* ${prefix + cmd} <no> close
- to close the group only admins can send messages

*4.* ${prefix + cmd} <no> mute
- to mute / turn off in the group

*5.* ${prefix + cmd} <no> unmute
- to unmute / turn on in the group

*6.* ${prefix + cmd} <no> link
- to get the group invite link, make sure the bot is an admin

*7.* ${prefix + cmd} <no> leave
- to leave the group

*8.* ${prefix + cmd} <no> reset
- to reset group configuration to default

*9.* ${prefix + cmd} <no> forever
- to make bots stay forever in the group

*10.* ${prefix + cmd} <no> 30d
- to set the duration of the bot in the group
Example : ${prefix + cmd} 2 1d

*NB* : Make sure you reply to messages containing group list to use this moderation options, send _${prefix}groups_ to show all group list.`
}