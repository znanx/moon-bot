module.exports = [{
   help: ['bomb'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.bomb = conn.bomb ? conn.bomb : {}
      let id = m.chat
      if (id in conn.bomb) return conn.reply(m.chat, Func.texted('bold', '^ Masih ada sesi yang belum selesai.'), conn.bomb[id][0])
      const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5)
      const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
      const array = bom.map((v, i) => ({
         emot: v,
         number: number[i],
         position: i + 1,
         state: false,
         player: m.sender
      }))
      let teks = `乂  *B O M B*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
      for (let i = 0; i < array.length; i += 3) teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
      teks += `\nTimeout : [ *${((env.timer / 1000) / 60)} menit* ]\nApabila mendapat kotak yang berisi bom maka exp akan di kurangi.`
      let msg = await conn.reply(m.chat, teks, m)
      let { key } = msg
      let v
      conn.bomb[id] = [
         msg,
         array,
         setTimeout(() => {
            v = array.find(v => v.emot == '💥')
            if (conn.bomb[id]) conn.reply(m.chat, `*Waktu habis!*, Bom berada di kotak nomor ${v.number}`, conn.bomb[id][0])
            delete conn.bomb[id]
         }, env.timer), key
      ]
   },
   limit: true,
   game: true,
   group: true
}, {
   run: async (m, {
      conn,
      body,
      users,
      env,
      Func
   }) => {
      try {
         let id = m.chat
         let reward = Func.randomInt(env.min_reward, env.max_reward)
         conn.bomb = conn.bomb ? conn.bomb : {}
         if (conn.bomb[id] && m.quoted && m.quoted.id == conn.bomb[id][3].id && !isNaN(body)) {
            let json = conn.bomb[id][1].find(v => v.position == body)
            console.log(json)
            if (!conn.bomb[id][1].find((v) => v.player === m.sender)) return conn.reply(m.chat, '🚩 Bukan sesi permainanmu.', m)
            if (!json) return conn.reply(m.chat, `🚩 Untuk membuka kotak kirim angka 1 - 9`, m)
            if (json.emot == '💥') {
               json.state = true
               let bomb = conn.bomb[id][1]
               let teks = `乂  *B O M B*\n\n`
               teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
               teks += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
               teks += `*Permainan selesai!*, kotak berisi bom terbuka : (- *${Func.formatNumber(reward)}*)`
               conn.reply(m.chat, teks, m).then(() => {
                  users.exp < reward ? users.exp = 0 : users.exp -= reward
                  clearTimeout(conn.bomb[id][2])
                  delete conn.bomb[id]
               })
            } else if (json.state) {
               return conn.reply(m.chat, `🚩 Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, m)
            } else {
               json.state = true
               let changes = conn.bomb[id][1]
               let open = changes.filter(v => v.state && v.emot != '💥').length
               if (open >= 8) {
                  let teks = `乂  *B O M B*\n\n`
                  teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                  teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                  teks += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
                  teks += `*Permainan selesai!* kotak berisi bom tidak terbuka : (+ *${Func.formatNumber(reward)}*)`
                  conn.reply(m.chat, teks, m).then(() => {
                     users.exp += reward
                     clearTimeout(conn.bomb[id][2])
                     delete conn.bomb[id]
                  })
               } else {
                  let teks = `乂  *B O M B*\n\n`
                  teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                  teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                  teks += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
                  teks += `Kotak berisi bom tidak terbuka : (+ *${Func.formatNumber(reward)}*)`
                  conn.sendMessage(m.chat, {
                     text: teks,
                     edit: conn.bomb[id][3]
                  }).then(() => {
                     users.exp += reward
                  })
               }
            }
         }
      } catch (e) {
         return conn.reply(m.chat, e, m)
      }
   },
   game: true,
   group: true
}]