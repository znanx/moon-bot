module.exports = {
   help: ['welcome', 'left', 'autodetect', 'antidelete', 'antilink', 'antivirtex', 'autosticker', 'antisticker', 'antitagsw', 'antiporn', 'antitoxic'],
   use: 'on / off',
   tags: 'admin',
   run: async (m, {
      conn,
      args,
      command,
      isBotAdmin,
      groupSet: setting,
      Func
   }) => {
      try {
         let type = command.toLowerCase()
         if (!isBotAdmin && /antilink|antivirtex|antitoxic|antisticker|antitagsw/.test(type)) return conn.reply(m.chat, global.status.botAdmin, m)
         if (!args || !args[0]) return conn.reply(m.chat, `🚩 *Current status* : [ ${setting[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
         let option = args[0].toLowerCase()
         let optionList = ['on', 'off']
         if (!optionList.includes(option)) return conn.reply(m.chat, `🚩 *Current status* : [ ${setting[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
         let status = option != 'on' ? false : true
         if (setting[type] == status) return conn.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option == 'on' ? 'activated' : 'inactivated'} previously.`), m)
         setting[type] = status
         conn.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option == 'on' ? 'activated' : 'inactivated'} successfully.`), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   admin: true,
   group: true,
   error: false
}