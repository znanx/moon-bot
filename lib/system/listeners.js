const { Function: Func, Config: env } = require('@znan/wabot')
const { NodeCache } = require('@cacheable/node-cache')
const cache = new NodeCache({
   stdTTL: env.spam.cooldown
})
const Notifier = require('./notifier')

module.exports = (conn, system) => {
   const notify = new Notifier(conn.sock, false)
   notify.start(15)

   conn.on('import', x => {
      require('../../handler')(conn.sock, x, system.database)
      require('./simple')(conn.sock)
   })

   conn.on('message.delete', async x => {
      try {
         if (!x.msg || x.msg.key.fromMe) return
         const sender = x.msg.key.participant || x.msg.key.remoteJid
         const groupSet = global.db.groups[x.jid]
         if (!sender || x.msg.isBot || cache.get(sender)) return
         cache.set(sender, 1)
         if (groupSet && groupSet.antidelete) return await conn.sock.copyNForward(x.jid, x.msg).catch(e => console.log(e, x.msg))
      } catch (e) {
         console.log(e)
      }
   })

   conn.on('presence.update', ({ id, presences }) => {
      if (!presences) return
      const sock = conn.sock
      if (!global.db) return
      if (id.endsWith('g.us')) {
         for (let sender in presences) {
            let entry = global.db.users[sender] ? [sender, global.db.users[sender]] : Object.entries(global.db.users).find(([_, v]) => v.lid === sender)
            if (!entry) continue
            let [jid, user] = entry
            const presence = presences[jid] || presences[user?.lid]
            if (!presence || user?.lid === sock.decodeJid(sock.user.lid)) continue
            if ((presence.lastKnownPresence === 'composing' || presence.lastKnownPresence === 'recording') && user.afk > -1) {
               let users = global.db.users[jid] || Object.values(global.db.users).find(v => v.lid === jid)
               sock.reply(id, `System detects activity from @${jid.replace(/@.+/, '')} after being offline for : ${Func.texted('bold', Func.toTime(new Date - (users?.afk || 0)))}\n\n➠ ${Func.texted('bold', 'Reason')} : ${users?.afkReason || '-'}`, users?.afkObj)
               users.afk = -1
               users.afkReason = ''
               users.afkObj = {}
            }
         }
      } else { }
   })

   conn.on('stories', async x => {
      try {
         if (x.key && x.sender !== conn.sock.decodeJid(conn.sock.user.id)) await conn.sock.sendMessage('status@broadcast', {
            react: {
               text: Func.random(['🤣', '🥹', '😂', '😋', '😎', '🤓', '🤪', '🥳', '😠', '😱', '🤔']),
               key: x.key
            }
         }, {
            statusJidList: [x.sender]
         })
      } catch (e) {
         console.log(e)
      }
   })

   conn.on('group-participants.update', async x => {
      try {
         if (!global.db || !global.db.groups) return
         const groupSet = global.db.groups[x.jid]
         if (!groupSet) return
         const pic = await conn.sock.profilePictureUrl(x.member, 'image') || await Func.fetchBuffer('./src/image/default.jpg')
         if (x.action === 'add') {
            const text = 'Hi @user👋\nWelcome to @subject\n\n@desc'
            const txt = (groupSet && groupSet.text_welcome ? groupSet.text_welcome : text).replace('@user', `@${x.member.split`@`[0]}`).replace('@subject', x.subject || '').replace('@desc', x.groupMetadata.desc || '')

            if (groupSet && groupSet.welcome) conn.sock.sendMessageModify(x.jid, txt, null, {
               largeThumb: true,
               thumbnail: pic,
               url: global.db.setting.link
            }, {
               ephemeral: 86400
            })
         } else if (x.action === 'remove') {
            const text = 'Sayonara @user👋👋'
            const txt = (groupSet && groupSet.text_left ? groupSet.text_left : text).replace('@user', `@${x.member.split`@`[0]}`)

            if (groupSet && groupSet.left) conn.sock.sendMessageModify(x.jid, txt, null, {
               largeThumb: true,
               thumbnail: pic,
               url: global.db.setting.link
            }, {
               ephemeral: 86400
            })
         } else if (x.action === 'promote') {
            const text = '🚩 @user has now been promoted to admin'
            const txt = text.replace('@user', `@${x.member.split`@`[0]}`)
            if (groupSet && groupSet.autodetect) conn.sock.reply(x.jid, txt, null, null, {
               ephemeral: 86400
            })
         } else if (x.action === 'demote') {
            const text = '🚩 @users have now been relegated to ordinary members'
            const txt = text.replace('@user', `@${x.member.split`@`[0]}`)
            if (groupSet && groupSet.autodetect) conn.sock.reply(x.jid, txt, null, null, {
               ephemeral: 86400
            })
         }
      } catch (e) {
         console.error(e)
      }
   })

   conn.on('groups.update', async update => {
      try {
         if (!global.db || !global.db.groups || !update) return
         const groupSet = global.db.groups?.[update.id] || {}
         if (!groupSet) return
         let txt = ''
         if (update.subject) txt = `🚩 Group name has changed to : [ *${update.subject}* ] by @${update.author ? update.author.split('@')[0] : 'unknown'}`
         if (update.desc) txt = `🚩 Group description has been changed by @${update.author ? update.author.split('@')[0] : 'unknown'}`
         if (update.announce !== undefined) txt = `🚩 Group has been ${update.announce ? 'closed' : 'opened'} by @${update.author ? update.author.split('@')[0] : 'unknown'}`
         if (update.memberAddMode !== undefined) txt = `🚩 Member add mode has been ${update.memberAddMode ? 'enabled' : 'disabled'} by @${update.author ? update.author.split('@')[0] : 'unknown'}`
         if (update.joinApprovalMode !== undefined) txt = `🚩 New member approval mode has been ${update.joinApprovalMode ? 'enabled' : 'disabled'} by @${update.author ? update.author.split('@')[0] : 'unknown'}`
         if (update.restrict !== undefined) txt = `🚩 The edit info setting has been changed to ${update.restrict ? 'admin only' : 'all member'} by @${update.author ? update.author.split('@')[0] : 'unknown'}`
         if (groupSet && groupSet.autodetect && txt) conn.sock.reply(update.id, txt, null, null, {
            ephemeral: 86400
         })
      } catch (e) {
         console.error(e)
      }
   })

   conn.on('call', async x => {
      if (global.db.setting && global.db.setting.anticall) {
         for (const id of x) {
            if (id.status === 'offer') {
               if (!id.isGroup) {
                  let msg = await conn.sock.reply(id.from, `Sorry, we are currently unable to accept calls, either group or private.\n\nIf you need assistance or would like to request a feature, please chat with the owner :p`, Func.fake(1, 'Anti Call'))
                  conn.sock.sendContact(id.from, [{
                     name: env.owner_name,
                     number: env.owner,
                     about: 'Owner & Creator'
                  }], msg, {
                     org: 'Moon Support',
                     website: 'https://api.alyachan.dev',
                     email: 'contact@moonx.my.id'
                  })
                  await conn.sock.rejectCall(id.id, id.from)
               } else { }
            }
         }
      }
   })
}