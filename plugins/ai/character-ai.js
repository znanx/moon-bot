module.exports = {
   help: ['cai'],
   aliases: ['character-ai'],
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      users,
      Func
   }) => {
      try {
         let args = text.split(' ')
         let action = args[0]?.toLowerCase()
         let content = args.slice(1).join(' ')
         if (!text) throw Func.example(usedPrefix, command, 'Halo, apa kabar?')
         if (action == 'search') {
            if (!content) throw Func.example(usedPrefix, command, 'search naruto')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/cai-search', {
               q: content
            })
            if (!json.status) throw Func.jsonFormat(json)
            let teks = '乂  *C H A R A S E A R C H*\n\n'
            json.data.map((v, i) => {
               teks += `   *${i + 1}*. ` + v.participant__name + '\n'
               teks += '   ∘  *Greeting* : ' + v.greeting + '\n'
               teks += '   ∘  *Visibility* : ' + v.visibility + '\n'
               teks += '   ∘  *Priority* : ' + v.priority + '\n'
               teks += '   ∘  *Scores* : ' + v.search_score + '\n'
               teks += '   ∘  *Interactions* : ' + v.participant__num_interactions + '\n'
               teks += '   ∘  *Character_Id* : ' + v.external_id + '\n\n'
            })
            conn.reply(m.chat, teks, m)
         } else if (action == 'set') {
            if (!content) throw Func.example(usedPrefix, command, 'set p9IKHMlMfxlMMst63NAeqEPMDVpG3ejbmuJ5Mg2hbzU')
            conn.sendReact(m.chat, '🕒', m.key)
            users.cai = content
            conn.reply(m.chat, Func.texted('bold', `Successfully set character_id : ${content}.`), m)
         } else if (action == 'generate') {
            if (!content) throw Func.example(usedPrefix, command, 'generate (​masterpiece:1.3), (8K, Photorealsitic, Raw photography, Top image quality: 1.4), Japan high school girls、(Random hairstyles:1.2)、cleavage of the breast:1.2、Super Detail Face、Eye of Detail、double eyelid、Bring your chest together、sharp focus:1.2、prety woman:1.4、light brown hair、top-quality、​masterpiece、超A high resolution、(Photorealsitic:1.4)、Highly detailed and professional lighting smile、Loose and light knitwear、Shoulder out、slender、serious facial expression、short-haired、Fatal position)')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/cai-image', {
               prompt: content
            })
            if (!json.status) throw Func.jsonFormat(json)
            await conn.sendMessage(m.chat, {
               image: { url: json.data.url }, fileName: Func.filename('jpg'), mimetype: 'image/jpeg'
            }, { quoted: m })
         } else {
            // Default action: chatting with the character
            conn.sendReact(m.chat, '🕒', m.key)
            if (!users.cai) throw Func.texted('bold', `Not found character_id.`)
            const json = await Api.get('/cai', {
               chara_id: users.cai,
               msg: text,
               single_reply: true
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.reply(m.chat, json.data.content, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   premium: true,
   error: false
}