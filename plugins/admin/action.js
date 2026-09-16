module.exports = {
   help: ['add', 'promote', 'demote', 'kick'],
   use: 'mention or reply',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      const findParticipantByLid = (value) => {
         if (!value || !Array.isArray(participants)) return null
         return participants.find(p => (p?.id || '').trim() === value.trim()) || null
      }

      const findParticipantByPhone = (value) => {
         if (!value || !Array.isArray(participants)) return null
         const target = value.trim()
         return participants.find(p => (p?.phoneNumber || '').trim() === target) || null
      }

      const resolveTarget = async (rawInput) => {
         const input = (rawInput || '').trim()
         if (!input) return { jid: '', participant: null }

         if (input.includes('@lid')) {
            const participant = findParticipantByLid(input)
            if (!participant) return { jid: '', participant: null }
            return {
               jid: (participant.phoneNumber || participant.id || '').trim(),
               participant
            }
         }

         if (input.includes('@s.whatsapp.net')) {
            const jid = conn.decodeJid(input)
            return {
               jid,
               participant: findParticipantByPhone(jid)
            }
         }

         const wa = await conn.onWhatsApp(input)
         if (!wa || !wa.length) return { jid: '', participant: null }

         const jid = conn.decodeJid(wa[0].jid)
         return {
            jid,
            participant: findParticipantByPhone(jid)
         }
      }

      let input = m?.mentionedJid?.[0] || m?.quoted?.sender || text
      if (!input) return conn.reply(m.chat, Func.texted('bold', `🚩 Mention or reply chat target.`), m)

      const resolved = await resolveTarget(input)
      if (!resolved.jid) {
         if (input.includes('@lid')) return conn.reply(m.chat, Func.texted('bold', `🚩 Cannot find user in group.`), m)
         return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
      }

      const jid = resolved.jid
      const participant = resolved.participant
      const number = jid.split('@')[0]
      const member = participant

      if (command === 'kick') {
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         if (jid === conn.user.id) return conn.reply(m.chat, Func.texted('bold', `🚩 Cannot kick the bot itself.`), m)
         await conn.groupParticipantsUpdate(m.chat, [jid], 'remove')
         return m.reply(Func.jsonFormat({ status: 'removed', jid }))
      }
      if (command === 'add') {
         if (member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already in this group.`), m)
         await conn.groupParticipantsUpdate(m.chat, [jid], 'add')
         return m.reply(Func.jsonFormat({ status: 'added', jid }))
      }
      if (command === 'demote') {
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         if (jid === conn.user.id) return conn.reply(m.chat, Func.texted('bold', `🚩 Cannot demote their own bots.`), m)
         await conn.groupParticipantsUpdate(m.chat, [jid], 'demote')
         return m.reply(Func.jsonFormat({ status: 'demoted', jid }))
      }
      if (command === 'promote') {
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         if (jid === conn.user.id) return conn.reply(m.chat, Func.texted('bold', `🚩 Cannot promote their own bots.`), m)
         await conn.groupParticipantsUpdate(m.chat, [jid], 'promote')
         return m.reply(Func.jsonFormat({ status: 'promoted', jid }))
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}