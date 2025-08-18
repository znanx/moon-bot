module.exports = {
   help: ['apakah', 'siapakah', 'kapankah', 'rate'],
   tags: 'random',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      try {
         if (!text) return m.reply(`Kamu kenapa??`)
         if (command == 'apakah') {
            let json = Func.random(['Ya', 'Mungkin iya', 'Mungkin', 'Mungkin tidak', 'Tidak', 'Tidak mungkin', 'Kurang tau', 'kayaknya iya', 'Mungkin sih', 'Sepertinya iya', 'Sepertinya tidak', 'mustahil', 'hooh', 'iyoooo', 'gak tau saya'])
            m.reply(Func.texted('bold', json))
         } else if (command == 'kapankah') {
            let json = Func.random(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'dekade', 'abad'])
            m.reply(Func.texted('bold', `${Math.floor(Math.random() * 10)} ${json} lagi ...`))
         } else if (command == 'siapakah') {
            let who
            if (!m.isGroup) {
               let member = [m.sender, conn.user.jid]
               who = member[Math.floor(Math.random() * member.length)]
            } else {
               let member = participants.map((u) => u.id)
               who = member[Math.floor(Math.random() * member.length)]
            }
            m.reply(`@${who.split`@`[0]}`)
         } else if (command == 'rate') {
            const json = Func.random(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'])
            conn.reply(m.chat, Func.texted('bold', `${text} ${json}%`), m)
         }
      } catch (e) {
         conn.reply(m.chat, global.status.error, m)
      }
   },
   limit: true,
   error: false
}