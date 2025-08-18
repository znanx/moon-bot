module.exports = {
   help: ['comicbox', 'gradientshadow', 'lava', 'thunder', 'neondevil', 'sumertimes', 'matrix', 'firework', 'neonlight', 'greenneon', 'pokemon', 'dragonball', 'naruto', 'blackpink', 'onglass', 'greenbrush', 'amongus', 'naruto2', 'flaming', 'woodblock'],
   use: 'text',
   tags: 'text maker',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moonbot'), m)
         if (text.length > 10) return conn.reply(m.chat, Func.texted('bold', '🚩 Max 10 character'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date(), link
         /** text pro */
         if (/comicbox/.test(command)) link = 'https://textpro.me/create-online-3d-comic-book-style-text-effects-1156.html'
         if (/gradientshadow/.test(command)) link = 'https://textpro.me/create-a-gradient-text-shadow-effect-online-1141.html'
         if (/lava/.test(command)) link = 'https://textpro.me/lava-text-effect-online-914.html'
         if (/thunder/.test(command)) link = 'https://textpro.me/create-thunder-text-effect-online-881.html'
         if (/neondevil/.test(command)) link = 'https://textpro.me/create-neon-devil-wings-text-effect-online-free-1014.html'
         if (/sumertimes/.test(command)) link = 'https://textpro.me/create-a-summer-neon-light-text-effect-online-1076.html'
         if (/matrix/.test(command)) link = 'https://textpro.me/matrix-style-text-effect-online-884.html'
         if (/firework/.test(command)) link = 'https://textpro.me/firework-sparkle-text-effect-930.html'
         if (/neonlight/.test(command)) link = 'https://textpro.me/neon-light-text-effect-with-galaxy-style-981.html'
         if (/greenneon/.test(command)) link = 'https://textpro.me/green-neon-text-effect-874.html'
         if (/pokemon/.test(command)) link = 'https://textpro.me/create-pokemon-logo-style-text-effect-online-1134.html'
         /** ephoto360 */
         if (/dragonball/.test(command)) link = 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html'
         if (/naruto/.test(command)) link = 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html'
         if (/blackpink/.test(command)) link = 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html'
         if (/onglass/.test(command)) link = 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html'
         if (/greenbrush/.test(command)) link = 'https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html'
         if (/amongus/.test(command)) link = 'https://en.ephoto360.com/create-a-cover-image-for-the-game-among-us-online-762.html'
         /** photooxy */
         if (/naruto2/.test(command)) link = 'https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html'
         if (/flaming/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html'
         if (/woodblock/.test(command)) link = 'https://photooxy.com/logo-and-text-effects/carved-wood-effect-online-171.html'
         let json = await Api.get('/textmaker', {
            url: link, text: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}