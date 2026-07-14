module.exports = {
   help: ['approve', 'reject'],
   use: 'list | all | number',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      const sub = args[0]?.trim().toLowerCase()
      const action = command === 'approve' ? 'approve' : 'reject'
      const status = action === 'approve' ? 'approved' : 'rejected'

      const showUsage = () => conn.reply(m.chat, Func.texted('bold',
         `🚩 Invalid format\n\n` +
         `*Example* :\n` +
         `◦ ${usedPrefix}${command} list\n` +
         `◦ ${usedPrefix}${command} all\n` +
         `◦ ${usedPrefix}${command} <number>`
      ), m)

      const pending = await conn.groupRequestParticipantsList(m.chat)
      if (!pending?.length) return conn.reply(m.chat, `🚩 *There are no pending join requests.*`, m)

      if (!sub || sub === 'list') {
         const lines = pending.map((v, i) => `${i + 1}. @${v.phone_number.split('@')[0]}`).join('\n')

         return conn.reply(m.chat,
            `🚩 *List of join requests* (${pending.length})\n\n${lines}\n\n` +
            `◦ ${usedPrefix}approve <number>\n` +
            `◦ ${usedPrefix}reject <number>\n` +
            `◦ ${usedPrefix}approve all`,
            m
         )
      }

      if (sub === 'all') {
         const jids = pending.map(v => v.phone_number)
         await conn.groupRequestParticipantsUpdate(m.chat, jids, action)

         return conn.reply(m.chat, `🚩 Successfully ${status} *${pending.length}* pending members.`, m)
      }

      const index = Number(sub)
      if (!Number.isInteger(index) || index < 1) return showUsage()

      if (index > pending.length) return conn.reply(m.chat,
         `🚩 Number *${index}* is not available. The list only contains *${pending.length}* people.`, m
      )

      const target = pending[index - 1]
      const jid = target.phone_number

      await conn.groupRequestParticipantsUpdate(m.chat, [jid], action)

      return conn.reply(m.chat, `🚩 Successfully ${status} : @${jid.split('@')[0]}`, m, {
         mentions: [jid]
      })
   },
   group: true,
   admin: true,
   isBotAdmin: true,
   error: false
}