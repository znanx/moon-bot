module.exports = {
   help: ['mute'],
   use: '0 / 1',
   tags: 'admin',
   run: async (m, {
      conn,
      args,
      groupSet: gc,
      Func
   }) => {
      let opt = [0, 1]
      if (!args || !args[0] || !opt.includes(parseInt(args[0]))) return conn.reply(m.chat, `🚩 *Current status* : [ ${gc.mute ? 'True' : 'False'} ] (Enter *1* or *0*)`, m)
      if (parseInt(args[0]) == 1) {
         if (gc.mute) return conn.reply(m.chat, Func.texted('bold', `🚩 Previously muted.`), m)
         gc.mute = true
         conn.reply(m.chat, Func.texted('bold', `🚩 Successfully muted.`), m)
      } else if (parseInt(args[0]) == 0) {
         if (!gc.mute) return conn.reply(m.chat, Func.texted('bold', `🚩 Previously unmuted.`), m)
         gc.mute = false
         conn.reply(m.chat, Func.texted('bold', `🚩 Successfully unmuted.`), m)
      }
   },
   admin: true,
   group: true,
   error: false
}