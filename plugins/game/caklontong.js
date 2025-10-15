module.exports = [{
   help: ['caklontong'],
   aliases: ['cakclue', 'cakskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.caklontong = conn.caklontong ? conn.caklontong : {}
      let id = m.chat
      if (command == 'caklontong') {
         if (id in conn.caklontong) return conn.reply(m.chat, 'There are still unanswered questions.', conn.caklontong[id][0])
         const json = await Func.jsonRandom('https://raw.githubusercontent.com/znanx/db/refs/heads/master/games/caklontong.json')
         let txt = `${json.soal}\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}cakclue* for help, and *${usedPrefix}cakskip* to delete the game session.`
         conn.caklontong[id] = [
            await conn.reply(id, txt, m),
            json,
            setTimeout(() => {
               if (conn.caklontong[id]) conn.reply(m.chat, `Time's up!\n\n◦ *Answer* : ${json.jawaban}\n◦ *Desc* : ${json.deskripsi}`, conn.caklontong[id][0])
               delete conn.caklontong[id]
            }, env.timer)
         ]
      } else if (command == 'cakclue') {
         if (!(id in conn.caklontong)) return
         let clue = conn.caklontong[id][1].jawaban.replace(/[aiueo]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'cakskip') {
         if ((id in conn.caklontong)) return conn.reply(m.chat, '✅ The caklontong game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.caklontong[id][3])
            delete conn.caklontong[id]
         })
      }
   },
   limit: true,
   game: true,
   group: true,
   register: true
}, {
   run: async (m, {
      conn,
      prefixes,
      body,
      users,
      env,
      Func
   }) => {
      try {
         let id = m.chat
         let reward = Func.randomInt(env.min_reward, env.max_reward)
         conn.caklontong = conn.caklontong ? conn.caklontong : {}
         if (m.quoted && /cakclue/i.test(m.quoted.text)) {
            if (!(id in conn.caklontong) && /cakskip/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.caklontong[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.caklontong[id][1]))
               if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
                  conn.reply(m.chat, `✅ *+${Func.formatNumber(reward)}* Exp`, m).then(() => {
                     users.exp += reward
                     clearTimeout(conn.caklontong[id][3])
                     delete conn.caklontong[id]
                  })
               } else conn.reply(m.chat, '❌ Wrong!', m)
            }
         }
      } catch (e) {
         throw new Error(e)
      }
   },
   game: true,
   group: true
}]