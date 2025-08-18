module.exports = {
   help: ['bc', 'bcgc'],
   use: 'text or reply media',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         let chatJid = Object.entries(global.db.chats).filter(([jid, _]) => jid.endsWith('.net')).map(([jid, _]) => jid)
         let groupJid = Object.keys(global.db.groups)
         const id = command == 'bc' ? chatJid : groupJid
         if (id.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 Error, ID does not exist.`), m)
         conn.sendReact(m.chat, '🕒', m.key)
         if (text) {
            for (let jid of id) {
               await Func.delay(1500)
               await conn.sendMessageModify(jid, text, null, {
                  thumbnail: await Func.fetchBuffer('https://i.ibb.co/184N0Zh/image.jpg'),
                  largeThumb: true,
                  url: global.db.setting.link,
                  mentions: command == 'bcgc' ? await (await conn.groupMetadata(jid)).participants.map(v => v.id) : []
               })
            }
            conn.reply(m.chat, Func.texted('bold', `🚩 Successfully send broadcast message to ${id.length} ${command == 'bc' ? 'chats' : 'groups'}`), m)
         } else if (/image\/(webp)/.test(mime)) {
            for (let jid of id) {
               await Func.delay(1500)
               let media = await q.download()
               await conn.sendSticker(jid, media, null, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author,
                  mentions: command == 'bcgc' ? await (await conn.groupMetadata(jid)).participants.map(v => v.id) : []
               })
            }
            conn.reply(m.chat, Func.texted('bold', `🚩 Successfully send broadcast message to ${id.length} ${command == 'bc' ? 'chats' : 'groups'}`), m)
         } else if (/video|image\/(jpe?g|png)/.test(mime)) {
            for (let jid of id) {
               await Func.delay(1500)
               let media = await q.download()
               await conn.sendFile(jid, media, '', q.text ? '乂  *B R O A D C A S T*\n\n' + q.text : '', null, {
                  netral: true
               }, command == 'bcgc' ? {
                  contextInfo: {
                     mentionedJid: await (await conn.groupMetadata(jid)).participants.map(v => v.id)
                  }
               } : {})
            }
            conn.reply(m.chat, Func.texted('bold', `🚩 Successfully send broadcast message to ${id.length} ${command == 'bc' ? 'chats' : 'groups'}`), m)
         } else if (/audio/.test(mime)) {
            for (let jid of id) {
               await Func.delay(1500)
               let media = await q.download()
               await conn.sendFile(jid, media, '', '', null, {
                  netral: true
               }, command == 'bcgc' ? {
                  ptt: q.ptt,
                  contextInfo: {
                     mentionedJid: await (await conn.groupMetadata(jid)).participants.map(v => v.id)
                  }
               } : {})
            }
            conn.reply(m.chat, Func.texted('bold', `🚩 Successfully send broadcast message to ${id.length} ${command == 'bc' ? 'chats' : 'groups'}`), m)
         } else conn.reply(m.chat, Func.texted('bold', `🚩 Media / text not found or media is not supported.`), m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}