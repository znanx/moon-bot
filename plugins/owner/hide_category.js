module.exports = {
   help: ['+hide', '-hide'],
   use: 'category / tags',
   tags: 'owner',
   run: async (m, {
      conn,
      text,
      command,
      usedPrefix,
      plugins,
      setting,
      Func
   }) => {
      try {
         let all = [...new Set([...plugins.values()].map(p => p.tags).filter(t => t && t !== 'main'))]
         let target = text.toLowerCase().trim()
         if (!target) {
            let txt = `Use format ${usedPrefix + command} tags\n\n`
            txt += `Tags available:\n◦ ${all.join('\n◦ ')}\n\n`
            txt += `Tags that were hidden before:\n◦ ${setting.hidden.length > 0 ? setting.hidden.join('\n') : '-'}`
            return m.reply(txt)
         }
         if (!all.includes(target)) return conn.reply(m.chat, `⚠️ Category "${target}" not found.`, m)
         if (command === '+hide') {
            if (setting.hidden.includes(target)) return conn.reply(m.chat, `⚠️ Category "${target}" previously been hidden.`, m)
            setting.hidden.push(target)
            conn.reply(m.chat, `✅ Category "${target}" successfully hidden.`, m)
         } else if (command === '-hide') {
            if (!setting.hidden.includes(target)) return conn.reply(m.chat, `⚠️ Category "${target}" category does not exist.`, m)
            setting.hidden = setting.hidden.filter(cat => cat !== target)
            conn.reply(m.chat, `✅ Category "${target}" has been removed from hidden list.`, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}