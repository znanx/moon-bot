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

         let buffer = (mime || text) ? await q.download?.().catch(() => null) : null

         for (let jid of id) {
            try {
               await Func.delay(2000)
               let mentions = []

               if (command == 'bcgc') {
                  const meta = await conn.groupMetadata(jid).catch(() => null)
                  if (!meta) continue
                  mentions = meta.participants.map(v => v.phoneNumber)
               }

               if (text) {
                  await conn.sendMessageModify(jid, text, null, {
                     thumbnail: await Func.fetchBuffer('https://i.ibb.co/184N0Zh/image.jpg'),
                     largeThumb: true,
                     url: global.db.setting.link,
                     mentions: mentions
                  })
               } else if (/image\/(webp)/.test(mime)) {
                  await conn.sendSticker(jid, buffer, null, {
                     packname: global.db.setting.sk_pack,
                     author: global.db.setting.sk_author,
                     mentions: mentions
                  })
               } else if (/video|image\/(jpe?g|png)/.test(mime)) {
                  await conn.sendFile(jid, buffer, '', q.text ? '乂  *B R O A D C A S T*\n\n' + q.text : '', null, {
                     netral: true
                  }, {
                     contextInfo: { mentionedJid: mentions }
                  })
               } else if (/audio/.test(mime)) {
                  await conn.sendFile(jid, buffer, '', '', null, {
                     netral: true
                  }, {
                     ptt: q.ptt,
                     contextInfo: { mentionedJid: mentions }
                  })
               } else conn.reply(m.chat, Func.texted('bold', `🚩 Media / text not found or media is not supported.`), m)
            } catch (e) {
               console.error(e)
            }
         }
         conn.reply(m.chat, Func.texted('bold', `🚩 Successfully send broadcast message to ${id.length} ${command == 'bc' ? 'chats' : 'groups'}`), m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}