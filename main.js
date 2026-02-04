const { Connection, Database, Function: Func, Config: env } = require('@znan/wabot')
require('./lib/system/config'), require('./lib/system/function'), require('./lib/system/scraper')
const fs = require('fs')
const config = require('./config.json')

const connect = async () => {
   const url = process?.env?.DATABASE_URL
   const system = Database.create(url, env.database)

   const conn = new Connection({
      plugins_dir: 'plugins',
      session_dir: system.session ? system.session(url, 'session') : 'session',
      online: true,
      presence: true,
      bypass_ephemeral: true,
      pairing: config.pairing,
   }, {
      browser: env.pairing.browser,
      version: env.pairing.version,
      shouldIgnoreJid: jid => {
         return /(newsletter|bot)/.test(jid)
      }
   })

   conn.once('connect', async x => {
      /** load db */
      global.db = { users: {}, groups: {}, chats: {}, setting: {}, statistic: {}, sticker: {}, ...(await system.database.fetch() || {}) }
      /** save db */
      await system.database.save(global.db)
      /** write log */
      if (x && typeof x === 'object' && x.message) console.log(x.display, x.message)
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
         if (ramUsage >= require('bytes')(env.ram_limit)) {
            clearInterval(ramCheck)
            process.send('reset')
         }
      }, 60 * 1000)

      /* create temp directory if doesn't exists */
      if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

      /* clear temp folder every 12 hour */
      setInterval(async () => {
         try {
            const tmpFiles = fs.readdirSync('./tmp')
            if (tmpFiles.length > 0) {
               tmpFiles.filter(v => !v.endsWith('.file')).map(v => fs.unlinkSync('./tmp/' + v))
            }
         } catch { }
      }, 12 * 60 * 60 * 1000)

      /** save database every 2 min */
      setInterval(async () => {
         if (global.db) await system.database.save(global.db)
      }, 120_000)

      /* backup database every 2 hour (send .json file to owner) */
      setInterval(async () => {
         if (global?.db?.setting?.autobackup) {
            await system.database.save(global.db)
            fs.writeFileSync(env.database + '.json', JSON.stringify(global.db, null, null), 'utf-8')
            await conn.sock.sendFile(env.owner + '@s.whatsapp.net', fs.readFileSync('./' + env.database + '.json'), env.database + '.json', '', null)
         }
      }, 2 * 60 * 60 * 1000)

      /** listeners */
      require('./lib/system/listeners')(conn, system)
   })
}
connect().catch(() => connect())