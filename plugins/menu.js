const fs = require('fs')
const path = require('path')

module.exports = {
   aliases: ['help', 'menu'],
   run: async (m, {
      conn,
      usedPrefix,
      args,
      plugins,
      users,
      setting,
      env,
      Func
   }) => {
      let plugs = new Set(plugins.values())
      let category = {}
      for (let plugin of plugs) {
         let pluginFileName = path.parse(plugin.filePath).name
         if (!plugin.tags || plugin.tags === 'main' || setting.error?.includes(pluginFileName) || setting.hidden.includes(plugin.tags) || setting.pluginDisable?.includes(pluginFileName)) continue
         if (!category[plugin.tags]) category[plugin.tags] = []
         if (Array.isArray(plugin.help)) {
            for (let command of plugin.help) {
               category[plugin.tags].push({
                  command: command,
                  use: plugin.use || ''
               })
            }
         }
      }
      let sortedTags = Object.keys(category).sort()

      let style = setting.style
      let pkg = require('../package.json')
      let local_size = fs.existsSync('./' + env.database + '.json') ? await Func.getSize(fs.statSync('./' + env.database + '.json').size) : ''
      let message = setting.msg
         .replace('+greeting', Func.greeting())
         .replace('+tag', `@${m.sender.replace(/@.+/g, '')}`)
         .replace('+db', (/mongo/.test(process.env.DATABASE_URL) ? 'MongoDB' : /postgre/.test(process.env.DATABASE_URL) ? 'PostgreSQL' : `Local : ${local_size}`))
         .replace('+library', pkg.dependencies['@whiskeysockets/baileys'].replace(/^\^|~|>|</g, ''))
         .replace('+version', pkg.version)
      if (style === 1) {
         let txt = `${message}\n\n`
         for (let tag of sortedTags) {
            let formattedTag = tag.toUpperCase().split('').join(' ')
            txt += `乂  *${formattedTag}*\n\n`
            let cmd = category[tag].sort((a, b) => a.command.localeCompare(b.command))
            cmd.sort((a, b) => a.command.localeCompare(b.command))
            cmd.forEach((cmdObject, index) => {
               let box
               if (cmd.length === 1) box = '–'
               else if (index === 0) box = '┌'
               else if (index === cmd.length - 1) box = '└'
               else box = '│'
               let useText = cmdObject.use ? ` *${cmdObject.use}*` : ''
               txt += `${box}  ◦  ${usedPrefix}${cmdObject.command}${useText}\n`
            })
            txt += `\n`
         }
         txt += global.footer
         conn.sendMessageModify(m.chat, txt, m, {
            largeThumb: true,
            thumbnail: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
            url: setting.link
         })
      } else if (style === 2) {
         let tag = args.join(' ').toLowerCase()
         if (tag) {
            let cmdList = category[tag] || []
            if (cmdList.length === 0) return
            let cmd = cmdList.sort((a, b) => a.command.localeCompare(b.command))
            let txt = ''
            cmd.forEach((o, i) => {
               let box = '│'
               if (cmd.length === 1) box = '–'
               else if (i === 0) box = '┌'
               else if (i === cmd.length - 1) box = '└'
               txt += `${box}  ◦  ${usedPrefix}${o.command}${o.use ? ` *${o.use}*` : ''}`
               if (i !== cmd.length - 1) txt += '\n'
            })
            await m.reply(txt)
            return
         }
         let txt = `${message}\n\n`
         sortedTags.forEach((tag, index) => {
            let box = '│'
            if (sortedTags.length === 1) box = '–'
            else if (index === 0) box = '┌'
            else if (index === sortedTags.length - 1) box = '└'
            txt += `${box}  ◦  ${usedPrefix}menu ${tag}\n`
         })
         txt += '\n' + global.footer
         conn.sendMessageModify(m.chat, txt, m, {
            largeThumb: true,
            thumbnail: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
            url: setting.link
         })
      } else if (style === 3) {
         let tag = args.join(' ').toLowerCase()
         if (tag) {
            let cmdList = category[tag] || []
            if (cmdList.length === 0) return
            let commands = cmdList.sort((a, b) => a.command.localeCompare(b.command)).map((cmdObject, i) => {
               let box = '│'
               if (cmdList.length === 1) box = '–'
               else if (i === 0) box = '┌'
               else if (i === cmdList.length - 1) box = '└'
               return `${box}  ◦  ${usedPrefix}${cmdObject.command}${cmdObject.use ? ` *${cmdObject.use}*` : ''}`
            }).join('\n')
            m.reply(commands)
            return
         }
         let sections = []
         const label = {
            highlight_label: 'Many Used'
         }
         sortedTags.forEach(tag => {
            sections.push({
               ...(/download|conver|tool/.test(tag) ? label : {}),
               rows: [{
                  title: Func.ucword(tag),
                  description: `There are ${category[tag].length} commands`,
                  id: `${usedPrefix}menu ${tag}`
               }]
            })
         })
         let buttons = [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
               title: 'Tap Here!',
               sections
            })
         }]
         conn.sendIAMessage(m.chat, buttons, m, {
            header: '',
            media: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
            content: message,
            footer: global.footer
         })
      }
   },
   error: false
}