module.exports = [{
   help: ['tebakgambar'],
   aliases: ['picclue', 'picskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
      let id = m.chat
      if (command == 'tebakgambar') {
         if (id in conn.tebakgambar) return conn.reply(m.chat, 'There are still unanswered questions.', conn.tebakgambar[id][0])
         const json = await Func.jsonRandom('https://raw.githubusercontent.com/znanx/db/refs/heads/master/games/tebakgambar.json')
         let txt = `${json.deskripsi}\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}picclue* for help, and *${usedPrefix}picskip* to delete the game session.`
         conn.tebakgambar[id] = [
            await conn.sendFile(id, json.img, Func.filename('jpg'), txt, m),
            json,
            setTimeout(() => {
               if (conn.tebakgambar[id]) conn.reply(m.chat, 'Time\'s up!', conn.tebakgambar[id][0])
               delete conn.tebakgambar[id]
            }, env.timer)
         ]
      } else if (command == 'picclue') {
         if (!(id in conn.tebakgambar)) return
         let clue = conn.tebakgambar[id][1].jawaban.replace(/[aiueo]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'picskip') {
         if ((id in conn.tebakgambar)) return conn.reply(m.chat, '✅ The tebakgambar game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.tebakgambar[id][3])
            delete conn.tebakgambar[id]
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
         conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
         if (m.quoted && /picclue/i.test(m.quoted.text)) {
            if (!(id in conn.tebakgambar) && /picskip/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.tebakgambar[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.tebakgambar[id][1]))
               if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
                  await m.reply(`✅ *+${Func.formatNumber(reward)}* Exp`).then(() => {
                     users.exp += reward
                     clearTimeout(conn.tebakgambar[id][3])
                     delete conn.tebakgambar[id]
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