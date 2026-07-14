const { Connection, Database, Function: Func, Config } = require('@znan/wabot')
const fs = require('fs')

require('./lib/system/config')
require('./lib/system/function')
require('./lib/system/scraper')

const connect = async () => {
   const url = process?.env?.DATABASE_URL
   const system = Database.create(url, Config.database)

   const conn = new Connection({
      plugins_dir: 'plugins',
      session_dir: system.session ? system.session : 'session',
      online: true,
      presence: true,
      bypass_ephemeral: true,
      pairing: Config.pairing,
      bot: id => id && (id.startsWith('BAE') || /[-]/.test(id)),
      custom_id: 'moonx'
   }, {
      browser: Config.pairing.browser,
      version: Config.pairing.version,
      shouldIgnoreJid: jid => {
         return /(newsletter|bot)/.test(jid)
      }
   })

   let dbLoaded = false
   conn.once('connect', async x => {
      /** write log */
      if (x && typeof x === 'object' && x.message) console.log(x.display, x.message)
      /** load db */
      if (!dbLoaded) {
         dbLoaded = true
         global.db = { users: {}, groups: {}, chats: {}, setting: {}, statistic: {}, sticker: {}, ...(await system.database.fetch() || {}) }
         /** save db */
         await system.database.save(global.db)
      }
   })

   conn.on('error', err => {
      if (err.display) console.log(err.display, err.message)
      else console.log(err.message)
      if (err.message) Func.logFile(err.message)
   })

   conn.once('prepare', async x => {
      /** write log */
      console.log(x.display, x.message)

      /* auto restart if ram usage is over */
      const ramCheck = setInterval(() => {
         var ramUsage = process.memoryUsage().rss
         if (ramUsage >= require('bytes')(Config.ram_limit)) {
            clearInterval(ramCheck)
            process.send('reset')
         }
      }, 60 * 1000)

      /** save database every 2 min */
      setInterval(async () => {
         if (global.db) await system.database.save(global.db)
      }, 120_000)

      /* backup database every 2 hour (send .json file to owner) */
      setInterval(async () => {
         if (global?.db?.setting?.autobackup) {
            await system.database.save(global.db)
            fs.writeFileSync(Config.database + '.json', JSON.stringify(global.db, null, null), 'utf-8')
            await conn.sock.sendFile(Config.owner + '@s.whatsapp.net', fs.readFileSync('./' + Config.database + '.json'), Config.database + '.json', '', null)
         }
      }, 2 * 60 * 60 * 1000)

      /** listeners */
      require('./lib/system/listeners')(conn, system)
   })
}
connect().catch(() => connect())