module.exports = {
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
         switch (command) {
            case 'next':
            case 'skip':
            case 'stop': {
               let room = Object.values(conn.anonymous).find((room) => room.check(m.sender))
               if (!room) {
                  await conn.reply(m.chat, Func.texted('bold', `You are not in anonymous chat!, send ${usedPrefix}start to start anonymous chat`), m)
                  throw 0
               }
               conn.reply(m.chat, Func.texted('bold', `You have dismissed the chat.`), m)
               let other = room.other(m.sender)
               if (other) conn.reply(m.chat, Func.texted('bold', `The partner has stopped the chat, type .start to find the partner again.`), m)
               delete conn.anonymous[room.id]
               if (command === 'stop') break
            }

            case 'search':
            case 'start': {
               if (Object.values(conn.anonymous).find((room) => room.check(m.sender))) return m.reply(Func.texted('bold', 'You are still in anonymous chat'))
               let room = Object.values(conn.anonymous).find((room) => room.state === 'WAITING' && !room.check(m.sender))
               if (room) {
                  conn.reply(room.a, Func.texted('bold', `Finding a partner`), m)
                  room.b = m.sender
                  room.state = 'CHATTING'
                  conn.reply(room.b, Func.texted('bold', 'Finding a partner'), m)
               } else {
                  let id = +new Date()
                  conn.anonymous[id] = {
                     id,
                     a: m.sender,
                     b: '',
                     state: 'WAITING',
                     check: function (who = '') {
                        return [conn.a, conn.b].includes(who)
                     },
                     other: function (who = '') {
                        return who === conn.a ? conn.b : who === conn.b ? conn.a : ''
                     },
                  }
                  conn.reply(m.chat, Func.texted('bold', 'Waiting for a partner...'), m)
               }
               break
            }
         }
      } catch (e) {
         console.log(e)
      }
   },
   private: true,
   error: false
}