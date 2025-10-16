const { Function: Func, Scraper, Spam, Config: env } = require('@znan/wabot')
const path = require('path')
const cron = require('node-cron')

const isSpam = new Spam({
   mode: env.spam.mode, /** command || msg || all */
   messageLimit: env.spam.limit,
   timeWindowSeconds: env.spam.time_window,
   cooldownSeconds: env.time_ban,
   maxBanTimes: env.max_ban,
   commandCooldownSeconds: env.spam.cooldown
})

module.exports = async (conn, ctx, database) => {
   var { store, m, body, prefix, plugins, loadCmd, loadEvt, commands, args, command, text, prefixes, core, isCommand } = ctx
   try {
      require('./lib/system/schema')(m, env)
      let groupSet = global.db.groups[m.chat]
      let chats = global.db.chats[m.chat]
      let users = global.db.users[m.sender]
      let setting = global.db.setting
      let isOwner = [conn.decodeJid(conn.user.id).replace(/@.+/, ''), env.owner, ...setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      let isPrem = users && users.premium || isOwner
      let groupMetadata = m.isGroup ? await conn.getGroupMetadata(m.chat) : {}
      let participants = m.isGroup ? groupMetadata ? conn.resolveLid(groupMetadata.participants) : [] : [] || []
      let adminList = m.isGroup ? participants?.filter(i => i.admin === 'admin' || i.admin === 'superadmin')?.map(i => i.id) || [] : []
      let isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      let isBotAdmin = m.isGroup ? adminList.includes((conn.user.id.split`:`[0]) + '@s.whatsapp.net') : false

      const spam = isSpam.check(conn, m, users, isCommand, command, setting)

      if (!setting.online) conn.sendPresenceUpdate('unavailable', m.chat)
      if (setting.online) {
         conn.sendPresenceUpdate('available', m.chat)
         conn.readMessages([m.key])
      }
      if (!setting.multiprefix) setting.noprefix = false
      if (setting.debug && !m.fromMe && isOwner) conn.reply(m.chat, Func.jsonFormat(m), m)
      if (!m.fromMe && m.isGroup && groupSet.antibot && !isOwner && isBotAdmin) {
         if (m.isBot || /interactiveMessage|buttonsMessage/.test(m.mtype)) return conn.reply(m.chat, Func.texted('italic', `⚠ Bot lain tidak diperbolehkan di grup ini..`), m).then(async () => {
            await Func.delay(15_000)
            conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
         })
      }
      if (m.isGroup) {
         groupSet.activity = new Date() * 1
         groupSet.name = groupMetadata?.subject ?? ''
      }
      if (users) {
         if (!users.lid) {
            const { lid } = await conn.getUserId(m.sender)
            if (lid) users.lid = lid
         }
         users.name = m.pushName
         users.lastseen = new Date() * 1
      }
      if (chats) {
         chats.chat += 1
         chats.lastseen = new Date * 1
      }
      if (m.isGroup && !m.isBot && users?.afk > -1) {
         conn.reply(m.chat, `You are back online after being offline for : ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n◦ ${Func.texted('bold', 'Reason')}: ${users?.afkReason || '-'}`, m)
         users.afk = -1
         users.afkReason = ''
         users.afkObj = {}
      }
      cron.schedule('00 00 * * *', async () => {
         setting.lastReset = new Date * 1
         Object.values(global.db.users).filter(v => v.limit < env.limit && !v.premium).map(v => v.limit = env.limit)
         Object.entries(global.db.statistic).map(([_, prop]) => prop.today = 0)
      }, {
         scheduled: true,
         timezone: process.env.TZ
      })
      if (m.isGroup && !m.fromMe) {
         let now = new Date() * 1
         const { lid } = await conn.getUserId(m.sender)
         if (!groupSet.member[m.sender]) {
            groupSet.member[m.sender] = {
               lid: lid,
               chat: 1,
               lastseen: now,
               warning: 0
            }
         } else {
            groupSet.member[m.sender].lastseen = now
            groupSet.member[m.sender].lid = lid
         }
      }
      if (setting.antispam && spam) {
         if (spam.status === 'ban_active') return
         if (spam.status === 'ban_temp') return conn.reply(m.chat, `🚩 [ ${spam.data.ban_times} / ${spam.data.max_ban} ] You are temporarily banned for *${spam.data.cooldown} seconds*.`, m)
         if (spam.status === 'ban_permanent') return conn.reply(m.chat, `🚩 [ ${spam.data.ban_times} / ${spam.data.max_ban} ] You've been warned many times! *You are permanently banned!*`, m)
         if (spam.status === 'cooldown') return // conn.reply(m.chat, Func.texted('italic', `🚩 Wait *${spam.data.remaining} seconds* before using *${prefix + spam.data.command}* again.`), m)
      }
      // if (body && !setting.self && core.prefix != setting.onlyprefix && commands.includes(core.command) && !setting.multiprefix && !env.evaluate_chars.includes(core.command)) return conn.reply(m.chat, `🚩 *Prefix needed!*, this bot uses prefix : *[ ${setting.onlyprefix} ]*\n\n➠ ${setting.onlyprefix + core.command} ${text || ''}`, m)
      const matcher = await Func.matcher(command, commands)
         .filter(v => v.accuracy >= 60)
         .sort((a, b) => b.accuracy - a.accuracy)
         .slice(0, 3) /** max 3 */
      if (prefix && !commands.includes(command) && matcher.length > 0) {
         if (!m.isGroup || (m.isGroup && !groupSet.mute)) {
            return conn.reply(m.chat, `🚩 Command you are using is wrong, try the following recommendations :\n\n${matcher.map(v => '➠ *' + (prefix ? prefix : '') + v.string + '* (' + v.accuracy.toFixed(2) + '%)').join('\n')}`, m)
         }
      }
      if (isCommand) {
         const plugin = loadCmd.get(command)
         if (!plugin) return
         if (commands.includes(command)) {
            users.hit += 1
            users.usebot = new Date() * 1
            Func.hitstat(command)
         }
         const name = path.parse(plugin.filePath).name
         if (!m.isGroup && env.blocks.some(no => m.sender.startsWith(no))) return conn.updateBlockStatus(m.sender, 'block')
         if (setting.pluginDisable?.includes(name)) return
         if (setting.error?.includes(command)) return conn.reply(m.chat, Func.texted('bold', `🚩 Command _${(prefix ? prefix : '') + command}_ disabled.`), m)
         if ((m.fromMe && m.isBot) || /broadcast|newsletter/.test(m.chat) || /Edit/.test(m.mtype)) return
         if (setting.self && !isOwner && !m.fromMe) return
         if (m.isGroup && groupSet && groupSet.adminonly && !isAdmin && !['groupinfo', 'link', 'me'].includes(name)) return
         if (!m.isGroup && !['owner', 'anonymous', 'anonymous-send_contact'].includes(name) && chats && !isPrem && !isOwner && !users.banned && setting.groupmode) return conn.sendMessageModify(m.chat, `⚠️ The bot is currently in group mode. To use it in private chats, please join the group first or upgrade to the premium package by sending *${prefixes[0]}premium.*`, m, {
            largeThumb: true,
            thumbnail: 'https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg',
            url: setting.link
         }).then(() => chats.lastchat = new Date() * 1)
         if (!['me', 'owner'].includes(name) && users && (users.banned || new Date - users.ban_temporary < env.timeout)) return
         if (m.isGroup && !['activation', 'groupinfo'].includes(name) && groupSet.mute) return

         if (plugin.error) return conn.reply(m.chat, global.status.errorF, m)
         if (plugin.owner && !isOwner) return conn.reply(m.chat, global.status.owner, m)
         if (plugin.restrict && !isPrem && !isOwner && text && new RegExp('\\b' + setting.toxic.join('\\b|\\b') + '\\b').test(text.toLowerCase())) {
            return conn.reply(m.chat, `⚠️ You have violated the *Terms and Conditions* of bot usage by using prohibited keywords. As punishment for your violation, your account has been banned.`, m).then(() => {
               users.banned = true
               conn.updateBlockStatus(m.sender, 'block')
            })
         }
         if (plugin.premium && !isPrem) return conn.reply(m.chat, global.status.premium, m)
         if (plugin.limit && users.limit < 1) return conn.reply(m.chat, `⚠️ You reached the limit and will be reset at 00.00\n\nTo get more limits upgrade to premium plans.`, m)
         if (plugin.group && !m.isGroup) return conn.reply(m.chat, global.status.group, m)
         if (plugin.botAdmin && !isBotAdmin) return conn.reply(m.chat, global.status.botAdmin, m)
         if (plugin.admin && !isAdmin) return conn.reply(m.chat, global.status.admin, m)
         if (plugin.private && m.isGroup) return conn.reply(m.chat, global.status.private, m)
         if (plugin.game && !setting.game) return conn.reply(m.chat, global.status.gameInactive, m)
         if (plugin.register && !users.registered) return conn.reply(m.chat, `To use this command, please register first with the command *${prefix}reg gender + age*`, m)
         try {
            await plugin.run(m, { ctx, conn, store, body, usedPrefix: prefix, plugins, commands, args, command, text, prefixes, core, isCommand, database, env, groupSet, chats, users, setting, isOwner, isPrem, groupMetadata, participants, isAdmin, isBotAdmin, Func, Scraper })
            if (plugin.limit && !plugin.game && users.limit > 0) {
               const limit = plugin.limit === 'Boolean' ? 1 : plugin.limit
               if (users.limit >= limit) {
                  users.limit -= limit
               } else {
                  return conn.reply(m.chat, `⚠️ Your limit isn't enough to use this feature.`, m)
               }
            }
         } catch (e) {
            return conn.reply(m.chat, e.toString(), m)
         }
      } else {
         for (const event of loadEvt) {
            const name = path.parse(event.filePath).name
            if ((m.fromMe && m.isBot) || /broadcast|newsletter/.test(m.chat) || /pollUpdate/.test(m.mtype)) continue
            if (!m.isGroup && env.blocks.some(no => m.sender.startsWith(no))) return conn.updateBlockStatus(m.sender, 'block')
            if (m.isGroup && groupSet && groupSet.adminonly && !isAdmin && !['anti_link', 'anti_porn', 'anti_sticker', 'anti_tagsw', 'anti_toxic', 'anti_viewonce', 'anti_virtex'].includes(name)) continue
            if (setting.self && !['anti_link', 'anti_porn', 'anti_sticker', 'anti_tagsw', 'anti_toxic', 'anti_viewonce', 'anti_virtex'].includes(name) && !isOwner && !m.fromMe) continue
            if (!['anti_link', 'anti_porn', 'anti_sticker', 'anti_tagsw', 'anti_toxic', 'anti_viewonce', 'anti_virtex'].includes(name) && users && (users.banned || new Date - users.ban_temporary < env.timeout)) continue
            if (!['anti_link', 'anti_porn', 'anti_sticker', 'anti_tagsw', 'anti_toxic', 'anti_viewonce', 'anti_virtex'].includes(name) && groupSet && groupSet.mute) continue
            if (!m.isGroup && setting.groupmode && !['anonymous_chat', 'chatbot'].includes(name) && !isPrem) return conn.sendMessageModify(m.chat, `⚠️ The bot is currently in group mode. To use it in private chats, please join the group first or upgrade to the premium package by sending *${prefixes[0]}premium.*`, m, {
               largeThumb: true,
               thumbnail: 'https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg',
               url: setting.link
            }).then(() => chats.lastchat = new Date() * 1)
            if (event.error) continue
            if (event.owner && !isOwner) continue
            if (event.group && !m.isGroup) continue
            if (event.botAdmin && !isBotAdmin) continue
            if (event.admin && !isAdmin) continue
            if (event.private && m.isGroup) continue
            if (event.game && !setting.game) continue
            if (event.register && !users.registered) continue
            if (event.download && body && Func.socmed(body) && !setting.autodownload && Func.generateLink(body) && Func.generateLink(body).some(v => Func.socmed(v))) continue
            try {
               await event.run(m, { ctx, conn, store, body, plugins, prefixes, core, isCommand, database, env, groupSet, chats, users, setting, isOwner, isPrem, groupMetadata, participants, isAdmin, isBotAdmin, Func, Scraper })
               if (event.limit && users.limit < 1 && body && Func.generateLink(body) && Func.generateLink(body).some(v => Func.socmed(v))) return conn.reply(m.chat, `⚠️ You reached the limit and will be reset at 00.00\n\nTo get more limits upgrade to premium plan.`, m)
            } catch (e) {
               return conn.reply(m.chat, e.toString(), m)
            }
         }
      }
   } catch (e) {
      console.error(e)
      Func.logFile(e)
   }
   Func.reload(require.resolve(__filename))
} 