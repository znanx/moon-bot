module.exports = {
   help: ['pornhub', 'marvelstudio', 'marvelstudio2', 'glitchtiktok', 'deadpool', '8bittext', 'thorlogo', 'captainamerica', 'amongus2'],
   use: 'text | text',
   tags: 'text maker',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'moon | bot')
         let [text1, text2] = text.split('|')
         if (text1.length > 10 || text2.length > 10) throw Func.texted('bold', '🚩 Max 10 character')
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date(), link
         /** text pro */
         if (/pornhub/.test(command)) link = 'https://textpro.me/generate-a-free-logo-in-pornhub-style-online-977.html'
         if (/marvelstudio/.test(command)) link = 'https://textpro.me/create-logo-style-marvel-studios-ver-metal-972.html'
         if (/marvelstudio2/.test(command)) link = 'https://textpro.me/create-logo-style-marvel-studios-online-971.html'
         if (/glitchtiktok/.test(command)) link = 'https://textpro.me/create-glitch-text-effect-style-tik-tok-983.html'
         if (/deadpool/.test(command)) link = 'https://textpro.me/create-deadpool-logo-style-text-effect-online-1159.html'
         if (/8bittext/.test(command)) link = 'https://textpro.me/video-game-classic-8-bit-text-effect-1037.html'
         /** ephoto360 */
         if (/thorlogo/.test(command)) link = 'https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html'
         if (/captainamerica/.test(command)) link = 'https://en.ephoto360.com/create-a-cinematic-captain-america-text-effect-online-715.html'
         if (/amongus2/.test(command)) link = 'https://en.ephoto360.com/create-a-banner-game-among-us-with-your-name-763.html'
         if (/latestspace/.test(command)) link = 'https://en.ephoto360.com/latest-space-3d-text-effect-online-559.html'
         const json = await Api.get('/textmaker2', {
            url: link, text1, text2
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(json)
      }
   },
   limit: true
}