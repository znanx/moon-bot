module.exports = [{
   help: ['math'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         conn.math = conn.math ? conn.math : {}
         if (text.length < 1) return conn.reply(m.chat, `Mode : ${Object.keys(modes).join(' | ')}\n\nExample : ${usedPrefix}math medium`, m)
         let mode = text.toLowerCase()
         if (!(mode in modes)) return conn.reply(m.chat, `Mode : ${Object.keys(modes).join(' | ')}\n\nExample : ${usedPrefix}math medium`, m)
         let id = m.chat
         if (id in conn.math) return conn.reply(m.chat, '^ There are still unanswered questions in this chat.', conn.math[id][0])
         let math = genMath(mode)
         let p = `乂  *M A T H*\n\n`
         p += `What is the result of *${math.str}*\n\n`
         p += `Time : [ *${(math.time / 60 / 1000)} minute* ]\n`
         p += `Reply to this message to answer the question..`
         conn.math[id] = [
            await conn.reply(m.chat, p, m),
            math,
            4,
            setTimeout(() => {
               if (conn.math[id]) conn.reply(m.chat, `*Time's up!*`, conn.math[id][0])
               delete conn.math[id]
            }, math.time),
         ]
      } catch (e) {
         console.error(e)
      }
   },
   limit: true,
   group: true,
   game: true
}, {
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      let id = m.chat
      conn.math = conn.math ? conn.math : {}
      if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0
      if (m.quoted && /What is the result of/i.test(m.quoted.text)) {
         if (!(id in conn.math) && /What is the result of/i.test(m.quoted.text)) return conn.reply(m.chat, '🚩 The question has ended.', m)
         let math = JSON.parse(JSON.stringify(conn.math[id][1]))
         if (m.text == math.result) {
            users.exp += math.bonus
            clearTimeout(conn.math[id][3])
            delete conn.math[id]
            m.react('✅').then(() => m.reply(`*+${math.bonus}* EXP`))
         } else {
            if (--conn.math[id][2] == 0) {
               clearTimeout(conn.math[id][3])
               delete conn.math[id]
               conn.reply(m.chat, `🚩 The opportunity is gone!`, m)
            } else m.react('❌')
         }
      }
   },
   group: false,
   error: false
}]

let modes = {
   noob: [-3, 3, -3, 3, '+-', 15000, 10],
   easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
   medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
   hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
   extreme: [-999999, 999999, -999999, 999999, '*/', 30000, 9999],
   impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000,],
   impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000,],
}

let operators = {
   '+': '+',
   '-': '-',
   '*': '×',
   '/': '÷',
}

function genMath(mode) {
   let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
   let a = randomInt(a1, a2)
   let b = randomInt(b1, b2)
   let op = pickRandom([...ops])
   let result = new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`)()
   if (op == '/') [a, result] = [result, a]
   return {
      str: `${a} ${operators[op]} ${b}`,
      mode,
      time,
      bonus,
      result,
   }
}

function randomInt(from, to) {
   if (from > to) [from, to] = [to, from]
   from = Math.floor(from)
   to = Math.floor(to)
   return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
   return list[Math.floor(Math.random() * list.length)]
}