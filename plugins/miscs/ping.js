const os = require('os')

module.exports = {
   help: ['ping'],
   tags: 'miscs',
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         const sentMsg = await conn.reply(m.chat, 'Testing Speed . . .', m)
         const reply = Object.entries(await getSystemStats(Func)).map(([key, val]) => `*${key}*: ${Array.isArray(val) ? val.join(', ') : val}`).join('\n')
         await conn.sendMessage(m.chat, {
            text: reply,
            edit: sentMsg.key
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   error: false
}

const getSystemStats = async (Func) => {
   const memoryUsage = process.memoryUsage()
   const cpuUsage = process.cpuUsage()

   return {
      node: process.version,
      platform: os.platform(),
      arch: os.arch(),
      cpuModel: os.cpus()[0]?.model || '',
      cpuCores: os.cpus().length,
      loadAverage: os.loadavg(),
      uptime: Func.toTime(os.uptime()),
      rss: await Func.getSize(memoryUsage.rss),
      heapTotal: await Func.getSize(memoryUsage.heapTotal),
      heapUsed: await Func.getSize(memoryUsage.heapUsed),
      external: await Func.getSize(memoryUsage.external),
      arrayBuffers: memoryUsage.arrayBuffers !== undefined ? await Func.getSize(memoryUsage.arrayBuffers) : 'N/A',
      totalMem: await Func.getSize(os.totalmem()),
      freeMem: await Func.getSize(os.freemem()),
      processCpuUserMs: Math.round(cpuUsage.user / 1000),
      processCpuSystemMs: Math.round(cpuUsage.system / 1000),
      pid: process.pid,
      homeDir: os.homedir(),
      hostname: os.hostname()
   }
}