
module.exports = {
   help: ['disable', 'enable'],
   use: 'command',
   tags: 'owner',
   run: async (m, {
      conn,
      args,
      command,
      usedPrefix,
      setting: cmd,
      plugins,
      Func
   }) => {
      if (!args || !args[0]) return conn.reply(m.chat, Func.example(usedPrefix, command, 'tiktok'), m)
      let commands = args[0]?.toLowerCase()
      if (!plugins.has(commands)) return conn.reply(m.chat, Func.texted('bold', `🚩 Command ${usedPrefix + commands} does not exist.`), m)
      if (command === 'disable') {
         if (cmd.error.includes(commands)) return conn.reply(m.chat, Func.texted('bold', `🚩 ${usedPrefix + commands} command was previously disabled.`), m)
         cmd.error.push(commands)
         conn.reply(m.chat, Func.texted('bold', `✅ Command ${usedPrefix + commands} disabled successfully.`), m)
      } else if (command === 'enable') {
         if (!cmd.error.includes(commands)) return conn.reply(m.chat, Func.texted('bold', `🚩 Command ${usedPrefix + commands} does not exist.`), m)
         cmd.error = cmd.error.filter(cmd => cmd !== commands)
         await conn.reply(m.chat, `✅ Command *${usedPrefix}${commands}* successfully activated.`, m)
      }
   },
   owner: true,
   error: false
}