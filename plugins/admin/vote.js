module.exports = [{
   help: ['vote'],
   use: 'start / stop',
   tags: ['admin'],
   run: async (m, {
      conn,
      args,
      usedPrefix,
      Func
   }) => {
      try {
         conn.vote = conn.vote ? conn.vote : {}
         const now = Date.now()

         const old = conn.vote[m.chat]
         if (old?.active && now - old.updatedAt > 24 * 60 * 60 * 1000) {
            delete conn.vote[m.chat]
         }

         const sub = (args[0] || '').toLowerCase()

         if (sub === 'start' || sub === 'mulai' || sub === 'buka') {
            if (conn.vote[m.chat]?.active) return conn.reply(m.chat, `Masih ada voting yang berjalan.\nKetik *${usedPrefix}vote stop* untuk menutupnya dulu.`, m)
            const raw = args.slice(1).join(' ')
            if (!raw.includes('|')) return conn.reply(m.chat, `Format salah!\n\n*${usedPrefix}vote start Judul | Opsi 1 | Opsi 2*\n\nContoh:\n*${usedPrefix}vote start Liburan kemana? | Bali | Jogja | Lombok*`, m)

            const parts = raw.split('|').map(s => s.trim()).filter(Boolean)
            if (parts.length < 3) return conn.reply(m.chat, `Minimal 1 judul dan 2 opsi.\nContoh: *${usedPrefix}vote start Makan dimana? | KFC | McD*`, m)

            const title = parts[0]
            const options = parts.slice(1)
            if (options.length > 12) return conn.reply(m.chat, `Maksimal 12 opsi.`, m)

            const sent = await conn.sendPoll(m.chat, title, options, m)
            if (!sent?.key?.id) return conn.reply(m.chat, `Gagal mengirim voting.`, m)

            conn.vote[m.chat] = {
               active: true,
               title,
               options: options.map(text => ({ text, voters: [] })),
               pollId: sent.key.id,
               createdAt: now,
               updatedAt: now
            }
            return conn.reply(m.chat, `Voting dibuka: *${title}*\nSilakan vote di poll di atas.\nTutup dengan *${usedPrefix}vote stop*`, m)
         }

         if (sub === 'stop' || sub === 'tutup' || sub === 'selesai' || sub === 'end') {
            const session = conn.vote[m.chat]
            if (!session?.active) return conn.reply(m.chat, `Tidak ada voting yang aktif.`, m)

            const results = session.options.map(o => [o.text, o.voters.length])
            await conn.sendPollResult(m.chat, session.title, results, m)
            delete conn.vote[m.chat]
            return
         }

         let guide = `*VOTING*\n\n`
         guide += `*${usedPrefix}vote start Judul | Opsi 1 | Opsi 2* : buka voting\n`
         guide += `*${usedPrefix}vote stop* : tutup & kirim hasil`
         return conn.reply(m.chat, guide, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   group: true,
   admin: true,
   error: false
}, {
   run: async (m, {
      conn
   }) => {
      try {
         if (!m.isGroup || m.mtype !== 'pollUpdateMessage') return !0
         conn.vote = conn.vote ? conn.vote : {}
         const session = conn.vote[m.chat]
         if (!session?.active) return !0
         if (Date.now() - session.updatedAt > 24 * 60 * 60 * 1000) {
            delete conn.vote[m.chat]
            return !0
         }
         const pollKey = m.msg?.pollCreationMessageKey
         if (session.pollId && pollKey?.id !== session.pollId) return !0

         for (const opt of session.options) {
            opt.voters = opt.voters.filter(v => v !== m.sender)
         }
         const selectedText = m.text
         if (selectedText) {
            const opt = session.options.find(o => o.text === selectedText)
            if (opt && !opt.voters.includes(m.sender)) opt.voters.push(m.sender)
         }
         session.updatedAt = Date.now()
         return !0
      } catch {
         return !0
      }
   },
   error: false
}]
