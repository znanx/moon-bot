module.exports = {
   help: ['igstalk', 'xstalk', 'tiktokstalk', 'mlstalk', 'ffstalk'],
   aliases: ['instagramstalk', 'twitstalk', 'twitterstalk', 'ttstalk'],
   use: 'username / id',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         switch (command) {
            case 'igstalk':
            case 'instagramstalk': {
               if (!text) throw Func.example(usedPrefix, command, 'bulansutena')
               conn.sendReact(m.chat, '🕒', m.key)
               const json = await Api.get('/searching/ig/stalk', {
                  username: text
               })
               if (!json.status) throw `🚩 ${json.msg}`
               let txt = '乂  *I G S T A L K*\n\n'
               txt += '   ∘  *Username* : ' + json.data.username + '\n'
               txt += `   ∘  *Name* : ${json.data.fullname || '-'}\n`
               txt += '   ∘  *Followers* : ' + Func.formatNumber(json.data.followers) + '\n'
               txt += '   ∘  *Followed* : ' + Func.formatNumber(json.data.following) + '\n'
               txt += '   ∘  *Post* : ' + json.data.post + '\n'
               txt += '   ∘  *Url* : https://instagram.com/' + json.data.username + '\n'
               txt += `   ∘  *Bio* : ${json.data.bio || '-'}\n\n`
               txt += global.footer
               conn.sendFile(m.chat, json.data.profile, Func.filename('jpg'), txt, m)
            }
            break

            case 'twitstalk':
            case 'xstalk':
            case 'twitterstalk': {
               if (!text) throw Func.example(usedPrefix, command, 'Nando35_')
               conn.sendReact(m.chat, '🕒', m.key)
               const json = await Api.get('/searching/x/stalk', {
                  username: text
               })
               if (!json.status) throw `🚩 ${json.msg}`
               let txt = `乂  *T W I T S T A L K*\n\n`
               txt += `   ∘  *Username* : ${json.data.username}\n`
               txt += `   ∘  *Nickname* : ${json.data.nickname}\n`
               txt += `   ∘  *Location* : ${json.data.join_at}\n`
               txt += `   ∘  *Join At* : ${json.data.location}\n`
               txt += `   ∘  *Tweets* : ${json.data.tweets_count}\n`
               txt += `   ∘  *Followers* : ${json.data.followers}\n`
               txt += `   ∘  *Followed* : ${json.data.following}\n\n`
               txt += global.footer
               conn.sendFile(m.chat, json.data.profile, '', txt, m)
            }
            break

            case 'ttstalk':
            case 'tiktokstalk': {
               if (!text) throw Func.example(usedPrefix, command, 'znan.store')
               conn.sendReact(m.chat, '🕒', m.key)
               const json = await Api.get('/searching/tiktok/stalk', {
                  username: text
               })
               if (!json.status) throw `🚩 ${json.msg}`
               let txt = `乂  *T T S T A L K*\n\n`
               txt += `   ∘  *Name* : ${json.userInfo.nickname}\n`
               txt += `   ∘  *Username* : ${json.userInfo.uniqueId}\n`
               txt += `   ∘  *Private* : ${json.userInfo.privateAccount}\n`
               txt += `   ∘  *Follower* : ${json.userInfo.stats.followerCount}\n`
               txt += `   ∘  *Following* : ${json.userInfo.stats.followingCount}\n`
               txt += `   ∘  *Like* : ${json.userInfo.stats.heartCount}\n`
               txt += `   ∘  *Video* : ${json.userInfo.stats.videoCount}\n`
               txt += `   ∘  *Bio* : ${json.userInfo.signature}\n`
               txt += `   ∘  *Bio Link* : ${json.userInfo.bioLink.link}\n`
               txt += `   ∘  *Category* : ${json.userInfo.commerceUserInfo.category}\n\n`
               txt += global.footer
               conn.sendFile(m.chat, json.userInfo.avatarLarger, '', txt, m)
            }
            break
            
            case 'mlstalk': {
               if (!text) throw Func.example(usedPrefix, command, '99042161 | 2513')
               let [game, zone] = text.split(' | ')
               if (!game || !zone) throw Func.example(usedPrefix, command, '99042161 | 2513')
               conn.sendReact(m.chat, '🕒', m.key)
               const json = await Api.get('/searching/mlstalk', {
                  gameid: game, zoneid: zone
               })
               if (!json.status) throw `🚩 ${json.msg}`
               conn.reply(m.chat, `◦ *Name* : ${json.data.name}\n◦ *Region* : ${json.data.region}`, m)
            }
            break

            case 'ffstalk': {
               if (!text) throw Func.example(usedPrefix, command, '35588677')
               conn.sendReact(m.chat, '🕒', m.key)
               const json = await Api.get('/searching/ffstalk', {
                  id: text
               })
               if (!json.status) throw `🚩 ${json.msg}`
               conn.reply(m.chat, `◦ *Name* : ${json.data.name}`, m)
            }
            break
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}