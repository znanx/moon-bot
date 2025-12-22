module.exports = {
   help: ['welcome', 'left', 'autodetect', 'antidelete', 'antilink', 'antivirtex', 'autosticker', 'antisticker', 'antitagsw', 'antiporn', 'antitoxic', 'antibot', 'autoclose'],
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
         
         if (type === 'autoclose' && !setting.autoclose) {
            setting.autoclose = {
               active: false,
               start: null,
               end: null,
               isClosed: false
            }
         }
         
         if (!isBotAdmin && /antilink|antivirtex|antitoxic|antisticker|antitagsw|antibot/.test(type)) return conn.reply(m.chat, global.status.botAdmin, m)
         if (!args || !args[0]) {
            if (type === 'autoclose') {
               return conn.reply(m.chat, `🚩 *Current status* : [ ${setting.autoclose?.active ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
            }
            return conn.reply(m.chat, `🚩 *Current status* : [ ${setting[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
         }
         let option = args[0].toLowerCase()
         let optionList = ['on', 'off']
         if (!optionList.includes(option)) {
            if (type === 'autoclose') {
               return conn.reply(m.chat, `🚩 *Current status* : [ ${setting.autoclose?.active ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
            }
            return conn.reply(m.chat, `🚩 *Current status* : [ ${setting[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
         }
         let status = option != 'on' ? false : true
         
         if (type === 'autoclose') {
            if (setting.autoclose.active === status) return conn.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option == 'on' ? 'activated' : 'inactivated'} previously.`), m)
            setting.autoclose.active = status
         } else {
            if (setting[type] == status) return conn.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option == 'on' ? 'activated' : 'inactivated'} previously.`), m)
            setting[type] = status
         }
         conn.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option == 'on' ? 'activated' : 'inactivated'} successfully.`), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   admin: true,
   group: true,
   error: false
}