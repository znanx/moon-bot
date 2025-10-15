module.exports = [{
   help: ['family100'],
   aliases: ['kuis', 'quiz'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.quiz = conn.quiz ? conn.quiz : {}
      let winScore = Func.randomInt(env.min_reward, env.max_reward)
      let id = 'quiz_' + m.chat
      if (id in conn.quiz) return conn.reply(m.chat, 'Masih ada kuis yang belum terjawab', conn.quiz[id].msg)
      const json = await Func.jsonRandom('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json')
      let caption = `
*Soal:* ${json.soal}

Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}

+${Func.formatNumber(winScore)} EXP tiap jawaban benar`.trim()
      conn.quiz[id] = {
         id,
         msg: await m.reply(caption),
         ...json,
         terjawab: Array.from(json.jawaban, () => false),
         winScore,
      }
   },
   limit: true,
   game: true,
   group: true
}, {
   run: async (m, {
      conn,
      users,
      env,
      Func
   }) => {
      try {
         conn.quiz = conn.quiz ? conn.quiz : {}
         let id = 'quiz_' + m.chat
         if (!(id in conn.quiz)) return !0
         let room = conn.quiz[id]
         let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
         let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
         if (!isSurrender) {
            let index = room.jawaban.indexOf(text)
            if (index < 0) {
               if (Math.max(...room.jawaban.filter((_, index) => !room.terjawab[index]).map(jawaban => Func.similarity(text, jawaban))) >= 0.7) m.reply('Dikit lagi!')
               return !0
            }
            if (room.terjawab[index]) return !0
            let users = global.db.users[m.sender]
            room.terjawab[index] = m.sender
            users.exp += room.winScore
         }
         let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
         let caption = `
*Soal* : ${room.soal}

Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)`: ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB*` : isSurrender ? '*MENYERAH!*' : ''}
${Array.from(room.jawaban, (jawaban, index) => { return isSurrender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false }).filter(v => v).join('\n')}

${isSurrender ? '' : `+${Func.formatNumber(room.winScore)} EXP tiap jawaban benar`}`.trim()
         m.reply(caption).then(msg => {
            return conn.quiz[id].msg = msg
         }).catch(_ => _)
         if (isWin || isSurrender) delete conn.quiz[id]
      } catch (e) {
         console.log(e)
      }
   },
   game: true,
   group: true
}]