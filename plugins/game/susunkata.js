module.exports = {
   help: ['susunkata'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         conn.susunkata = conn.susunkata || {}
         const id = m.chat

         if (id in conn.susunkata) return conn.reply(m.chat, '^ Masih ada soal Susun Kata yang belum dijawab di chat ini.', conn.susunkata[id].msg)

         const res = await fetch('https://raw.githubusercontent.com/BochilTeam/database/refs/heads/master/games/susunkata.json')
         const list = await res.json()
         const data = list[Math.floor(Math.random() * list.length)]

         const answer = data.jawaban.toLowerCase().trim()
         const shuffled = shuffleString(answer)

         const msg = await conn.reply(
            m.chat,
            `乂  *S U S U N K A T A*\n\n` +
            `Soal : *${data.soal}*\n` +
            `Kata : ${shuffled.split('').join(' ')}\n\n` +
            `Balas pesan ini dengan kata yang benar.`,
            m
         )

         conn.susunkata[id] = {
            msg,
            answer,
            tries: 3,
            timer: setTimeout(() => {
               if (conn.susunkata[id]) {
                  conn.reply(m.chat, `⏰ Waktu habis!`, msg)
                  delete conn.susunkata[id]
               }
            }, 60000)
         }

      } catch (e) {
         console.error(e)
      }
   },
   limit: true,
   group: true,
   game: true,
   error: false
}

function shuffleString(str) {
   const arr = str.split('')
   for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
         ;[arr[i], arr[j]] = [arr[j], arr[i]]
   }
   return arr.join('')
}