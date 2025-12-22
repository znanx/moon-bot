const cron = require('node-cron')
const { Function: Func } = require('@znan/wabot')

/**
 * Get current time in HH:mm format
 * @returns {string} Current time (e.g., "14:30")
 */
const getCurrentTime = () => {
   const now = new Date()
   const hours = String(now.getHours()).padStart(2, '0')
   const minutes = String(now.getMinutes()).padStart(2, '0')
   return `${hours}:${minutes}`
}

/**
 * Check if current time falls within range
 * @param {string} current - Current time in HH:mm
 * @param {string} start - Start time in HH:mm
 * @param {string} end - End time in HH:mm
 * @returns {boolean} True if current is within start-end range
 */
const isTimeInRange = (current, start, end) => {
   const curr = current.split(':').map(Number)
   const st = start.split(':').map(Number)
   const ed = end.split(':').map(Number)

   const currMin = curr[0] * 60 + curr[1]
   const startMin = st[0] * 60 + st[1]
   const endMin = ed[0] * 60 + ed[1]

   return currMin >= startMin && currMin < endMin
}

/**
 * Initialize auto group close scheduler
 * Runs every minute to check and update group status
 * @param {object} conn - Connection socket object
 */
const initAutoClose = (conn) => {
   cron.schedule('* * * * *', async () => {
      try {
         if (!global.db?.groups) return

         const currentTime = getCurrentTime()

         for (const [jid, groupSet] of Object.entries(global.db.groups)) {
            if (!groupSet.autoclose?.active || !groupSet.autoclose.start || !groupSet.autoclose.end) continue

            const { start, end, isClosed } = groupSet.autoclose
            const shouldBeClosed = isTimeInRange(currentTime, start, end)

            // Close group if time is within range
            if (shouldBeClosed && !isClosed) {
               try {
                  await conn.groupSettingUpdate(jid, 'announcement')
                  groupSet.autoclose.isClosed = true
                  conn.reply(jid, Func.texted('bold', `🚩 Group status changed CLOSED due to autoclose set ${start}-${end}`))
               } catch (e) {
                  console.log(`Error closing group ${jid}:`, e.message)
               }
            }
            // Open group if time is outside range
            else if (!shouldBeClosed && isClosed) {
               try {
                  await conn.groupSettingUpdate(jid, 'not_announcement')
                  groupSet.autoclose.isClosed = false
                  conn.reply(jid, Func.texted('bold', `🚩 Group status changed OPEN due to autoclose set ${start}-${end}`))
               } catch (e) {
                  console.log(`Error opening group ${jid}:`, e.message)
               }
            }
         }
      } catch (e) {
         console.log('Error in auto_close scheduler:', e.message)
      }
   }, {
      scheduled: true,
      timezone: process.env.TZ || 'Asia/Jakarta'
   })
}

module.exports = { initAutoClose }