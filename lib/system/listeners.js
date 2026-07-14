const { Function: Func, Config: env } = require('@znan/wabot')
const { NodeCache } = require('@cacheable/node-cache')
const cache = new NodeCache({
   stdTTL: env.spam.cooldown
})
const Notifier = require('./notifier')
const { initAutoClose } = require('./autoclose')

module.exports = (conn, system) => {
   const notify = new Notifier(conn.sock, false)
   notify.start(15)

   // Initialize auto close scheduler
   initAutoClose(conn.sock)

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
         let groupSet = global.db?.groups[id]
         if (!groupSet) return
         for (let sender in presences) {
            let entry = global.db.users[sender] ? [sender, global.db.users[sender]] : null
            if (!entry) continue
            let [jid, user] = entry
            const presence = presences[sender]
            if (!presence || user?.lid === sock.decodeJid(sock.user.id)) continue
            if ((presence.lastKnownPresence === 'composing' || presence.lastKnownPresence === 'recording') && user.afk > -1) {
               let users = global.db.users[jid]
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
         const setting = global.db?.setting
         if (!setting || !setting.readsw) return
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

   const groupCommon = async (x, conn) => {
      if (!global.db || !global.db.groups) return null
      const groupSet = global.db.groups[x.jid]
      if (!groupSet) return null

      const pic = await Promise.race([
         conn.sock.profilePictureUrl(x.member, 'image'),
         new Promise(resolve => setTimeout(() => resolve(null), 1200))
      ]).catch(() => null) || await Promise.race([
         conn.sock.profilePictureUrl(x.jid, 'image'),
         new Promise(resolve => setTimeout(() => resolve(null), 1200))
      ]).catch(() => null) || await Func.fetchBuffer('./src/image/default.jpg').catch(() => 'https://i.pinimg.com/736x/ea/77/6b/ea776b1d721a28b6213150d64d87a193.jpg')

      return { groupSet, pic }
   }

   conn.on('group.add', async x => {
      try {
         const ctx = await groupCommon(x, conn)
         if (!ctx) return
         const { groupSet, pic } = ctx

         const txt = (groupSet && groupSet.text_welcome ? groupSet.text_welcome : 'Hi @user👋\nWelcome to @subject\n\n@desc')
            .replace('@user', `@${x.member.split`@`[0]}`)
            .replace('@subject', x.subject || '')
            .replace('@desc', x.groupMetadata.desc || '')

         if (groupSet && groupSet.welcome) conn.sock.sendLinkPreview(x.jid, txt, null, {
            ratio: 'landscape', thumbnail: pic, url: global.db.setting.link
         }, { ephemeral: 86400 })
      } catch (e) {
         console.error(e)
      }
   })
   conn.on('group.remove', async x => {
      try {
         const ctx = await groupCommon(x, conn)
         if (!ctx) return
         const { groupSet, pic } = ctx

         const txt = (groupSet && groupSet.text_left ? groupSet.text_left : 'Sayonara @user👋👋').replace('@user', `@${x.member.split`@`[0]}`)

         if (groupSet && groupSet.left) conn.sock.sendLinkPreview(x.jid, txt, null, {
            ratio: 'landscape', thumbnail: pic, url: global.db.setting.link
         }, { ephemeral: 86400 })
      } catch (e) {
         console.error(e)
      }
   })
   conn.on('group.promote', async x => {
      try {
         const ctx = await groupCommon(x, conn)
         if (!ctx) return
         const { groupSet } = ctx

         const txt = '🚩 @user has now been promoted to admin'.replace('@user', `@${x.member.split`@`[0]}`)
         Func.delay(1000)
         if (groupSet && groupSet.detect) conn.sock.reply(x.jid, txt, null, null, { ephemeral: 86400 })
      } catch (e) { console.error(e) }
   })
   conn.on('group.demote', async x => {
      try {
         const ctx = await groupCommon(x, conn)
         if (!ctx) return
         const { groupSet } = ctx
         const txt = '🚩 @users have now been relegated to ordinary members'.replace('@user', `@${x.member.split`@`[0]}`)
         Func.delay(1000)
         if (groupSet && groupSet.detect) conn.sock.reply(x.jid, txt, null, null, { ephemeral: 86400 })
      } catch (e) { console.error(e) }
   })

   const groupUpdateCommon = async (x, conn) => {
      if (!global.db || !global.db.groups) return null
      const groupSet = global.db.groups?.[x.id] || {}
      if (!groupSet) return null
      Func.delay(1000)
      return groupSet
   }

   const groupUpdate = (x, txt) => {
      if (!global.db?.groups?.[x.id]?.detect) return
      Func.delay(1000)
      conn.sock.reply(x.id, txt, null, null, { ephemeral: 86400 })
   }

   conn.on('group.subject', x => x.subject && groupUpdate(x, `🚩 Group name has changed to : [ *${x.subject}* ] by @${x.author ? x.author.split('@')[0] : 'unknown'}`))
   conn.on('group.desc', x => groupUpdate(x, `🚩 Group description has been changed by @${x.author ? x.author.split('@')[0] : 'unknown'}`))
   conn.on('group.announce', x => groupUpdate(x, `🚩 Group has been ${x.announce ? 'closed' : 'opened'} by @${x.author ? x.author.split('@')[0] : 'unknown'}`))
   conn.on('group.restrict', x => groupUpdate(x, `🚩 The edit info setting has been changed to ${x.restrict ? 'admin only' : 'all member'} by @${x.author ? x.author.split('@')[0] : 'unknown'}`))
   conn.on('group.memberAddMode', x => groupUpdate(x, `🚩 Member add mode has been ${x.memberAddMode ? 'enabled' : 'disabled'} by @${x.author ? x.author.split('@')[0] : 'unknown'}`))
   conn.on('group.joinApprovalMode', x => groupUpdate(x, `🚩 New member approval mode has been ${x.joinApprovalMode ? 'enabled' : 'disabled'} by @${x.author ? x.author.split('@')[0] : 'unknown'}`))

   conn.on('group.request', async x => {
      if (!global.db?.groups?.[x.id]?.detect) return
      if (x.action === 'created') {
         conn.sock.reply(x.id, `🚩 @${x.participant.split('@')[0]} has sent a request to join this group.`, null, null, { ephemeral: 86400 })
      } else if (x.action === 'approved') {
         conn.sock.reply(x.id, `✅ The request to join from @${x.participant.split('@')[0]} has been approved by @${x.author?.split('@')[0]}.`, null, null, { ephemeral: 86400 })
      } else if (x.action === 'rejected') {
         conn.sock.reply(x.id, `❌ The request to join from @${x.participant.split('@')[0]} has been rejected by @${x.author?.split('@')[0]}.`, null, null, { ephemeral: 86400 })
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