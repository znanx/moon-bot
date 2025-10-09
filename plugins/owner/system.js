module.exports = {
   help: ['autobackup', 'autodownload', 'antispam', 'debug', 'groupmode', 'privatemode', 'multiprefix', 'noprefix', 'online', 'self', 'anticall', 'notifier', 'game'],
   use: 'on / off',
   tags: 'owner',
   run: async (m, {
      conn,
      args,
      usedPrefix,
      command,
      Func
   }) => {
      let system = global.db.setting
      let type = command.toLowerCase()
      if (!args || !args[0]) return conn.reply(m.chat, `🚩 *Current status* : [ ${system[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
      let option = args[0].toLowerCase()
      let optionList = ['on', 'off']
      if (!optionList.includes(option)) return conn.reply(m.chat, `🚩 *Current status* : [ ${system[type] ? 'ON' : 'OFF'} ] (Enter *On* or *Off*)`, m)
      let status = option != 'on' ? false : true
      if (system[type] == status) return conn.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option == 'on' ? 'activated' : 'inactivated'} previously.`), m)
      system[type] = status
      conn.reply(m.chat, Func.texted('bold', `🚩 ${Func.ucword(command)} has been ${option == 'on' ? 'activated' : 'inactivated'} successfully.`), m)
   },
   owner: true,
   error: false,
}