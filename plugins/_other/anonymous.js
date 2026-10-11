module.exports = [{
   help: ['start', 'skip', 'stop', 'next', 'search'],
   tags: 'anonymous',
   run: async (m, {
      conn,
      command,
      usedPrefix,
      text,
      Func
   }) => {
      try {
         command = command.toLowerCase()
         conn.anonymous = conn.anonymous ? conn.anonymous : {}
         const now = Date.now()
         for (const [id, room] of Object.entries(conn.anonymous)) {
            if (room.state === 'WAITING' && now - room.createdAt > 15 * 60 * 1000) delete conn.anonymous[id]
         }
         switch (command) {
            case 'next':
            case 'skip':
            case 'stop': {
               let room = Object.values(conn.anonymous).find((room) => room.check(m.sender))
               if (!room) {
                  await conn.reply(m.chat, Func.texted('bold', `You are not in anonymous chat!, send ${usedPrefix}start to start anonymous chat`), m)
                  return
               }
               let other = room.other(m.sender)
               delete conn.anonymous[room.id]
               await conn.reply(m.chat, Func.texted('bold', `You have dismissed the chat.`), m)
               if (other) await conn.reply(other, Func.texted('bold', `The partner has stopped the chat, type ${usedPrefix}start to find a new partner.`))
               if (command === 'stop') break
            }

            case 'search':
            case 'start': {
               if (Object.values(conn.anonymous).find((room) => room.check(m.sender))) return m.reply(Func.texted('bold', 'You are still in anonymous chat'))
               let room = Object.values(conn.anonymous).find((room) => room.state === 'WAITING' && !room.check(m.sender))
               if (room) {
                  room.b = m.sender
                  room.state = 'CHATTING'
                  await conn.reply(room.a, Func.texted('bold', `Partner found! Say hello 👋`))
                  await conn.reply(room.b, Func.texted('bold', `Partner found! Say hello 👋`), m)
               } else {
                  let id = +new Date()
                  conn.anonymous[id] = {
                     id,
                     a: m.sender,
                     b: '',
                     state: 'WAITING',
                     createdAt: now,
                     check: function (who = '') {
                        return [this.a, this.b].includes(who)
                     },
                     other: function (who = '') {
                        return who === this.a ? this.b : who === this.b ? this.a : ''
                     },
                  }
                  await conn.reply(m.chat, Func.texted('bold', 'Waiting for a partner...'), m)
               }
               break
            }
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   private: true,
   error: false
}, {
   help: ['sendcontact'],
   tags: 'anonymous',
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      try {
         conn.anonymous = conn.anonymous ? conn.anonymous : {}
         let who = m.sender
         let room = Object.values(conn.anonymous).find(room => room.check(who))
         if (!room) return conn.reply(m.chat, Func.texted('bold', 'You are not in anonymous chat'), m)
         let other = room.other(who)
         if (!other) return conn.reply(m.chat, Func.texted('bold', 'Waiting for a partner...'), m)
         let name = String(text || conn.getNameV2(m.sender) || who.split('@')[0]).replace(/\n/g, '\\n')
         let number = who.split('@')[0]
         let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`
         await conn.reply(m.chat, Func.texted('bold', `You successfully sent your contact to your partner.`), m)
         await conn.reply(other, Func.texted('bold', `Your partner shared their contact with you`))
         await conn.sendMessage(other, {
            contacts: {
               displayName: name,
               contacts: [{ vcard }]
            }
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   private: true,
   error: false
}, {
   run: async (m, {
      conn
   }) => {
      conn.anonymous = conn.anonymous ? conn.anonymous : {}
      let room = Object.values(conn.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
      if (room) {
         let other = [room.a, room.b].find(user => user !== m.sender)
         await conn.copyNForward(other, m, true)
      }
   },
   private: true,
   error: false
}]
