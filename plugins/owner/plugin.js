const path = require('path')

module.exports = {
   help: ['plugdis', 'plugen'],
   use: 'plugin name',
   tags: 'owner',
   run: async (m, {
      conn,
      args,
      command,
      usedPrefix,
      plugins: plugs,
      Func
   }) => {
      let pluginDisable = global.db.setting.pluginDisable
      if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'tiktok'), m)
      let allPluginFiles = [...new Set([...plugs.values()].map(p => path.parse(p.filePath).name))]
      if (!allPluginFiles.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${args[0]}.js not found.`), m)
      let plugin = [...plugs.values()].find(p => path.parse(p.filePath).name === args[0])
      let actualFilename = path.basename(plugin.filePath)
      if (command === 'plugdis') {
         if (pluginDisable.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${actualFilename}.js previously has been disabled.`), m)
         pluginDisable.push(args[0])
         conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${actualFilename} successfully disabled.`), m)
      } else if (command === 'plugen') {
         if (!pluginDisable.includes(args[0])) return conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${actualFilename} not found.`), m)
         global.db.setting.pluginDisable = global.db.setting.pluginDisable.filter(v => v !== args[0])
         conn.reply(m.chat, Func.texted('bold', `🚩 Plugin ${actualFilename} successfully enable.`), m)
      }
   },
   owner: true,
   error: false
}