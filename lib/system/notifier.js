// https://github.com/neoxr/neoxr-bot/blob/5.0-ESM/lib/notifier.js

const { Function: Func, Config: env } = require('@znan/wabot')

module.exports = class Notifier {
   /**
    * Creates an instance of Notifier.
    * @param {object} conn - The conn object used for sending messages and interacting with groups.
    * @param {boolean} [verbose=false] - Whether to log detailed messages to the console.
    */
   constructor(conn, verbose = false) {
      this.conn = conn
      this.verbose = verbose
      this.recurringIntervalId = null
   }

   /**
    * Asynchronously checks for premium user and group rent expirations.
    * Notifies users/groups about impending expirations and takes action (e.g., revokes premium, leaves group)
    * when a subscription expires.
    * Prevents concurrent execution using an internal flag (`_checkingPremium`).
    * @private
    */
   async _checkPremiumAndRent() {
      try {
         const data = global.db
         const now = Date.now()
         const day = 86400000

         // expired premium
         const premiumUsers = Object.entries(data.users || {}).filter(([jid, user]) => user.premium).sort(([, a], [, b]) => a.expired - b.expired)
         for (const [jid, user] of premiumUsers) {
            await Func.delay(15_000)
            const timeLeft = user.expired - now
            const daysLeft = Math.ceil(timeLeft / day)

            if (daysLeft > 0 && daysLeft <= 3 && user.lastnotified !== daysLeft) {
               if (data.setting.notifier) {
                  await this.conn.reply(jid, Func.texted('italic', `🚩 Your premium access will expire in ${daysLeft} day(s).`)).then(() => user.lastnotified = daysLeft)
               }
            } else if (daysLeft <= 0) {
               Object.assign(user, {
                  premium: false,
                  expired: 0,
                  limit: env.limit,
                  lastnotified: 0
               })
               if (data.setting.notifier) {
                  await this.conn.reply(jid, Func.texted('italic', `🚩 Your premium package has expired.`)).catch(() => { })
               }
            }
         }

         // expired group
         const rentedGroups = Object.entries(data?.groups || {}).filter(([jid, group]) => group.expired > 0).sort(([, a], [, b]) => a.expired - b.expired)
         for (const [jid, group] of rentedGroups) {
            await Func.delay(15_000)
            const timeLeft = group.expired - now
            const daysLeft = Math.ceil(timeLeft / day)
            if (daysLeft > 0 && daysLeft <= 3 && group.lastnotified !== daysLeft) {
               const meta = await this.conn.groupMetadata(jid)
               const participants = this.conn.resolveLid(meta.participants)
               if (data.setting.notifier) this.conn.reply(group.jid, Func.texted('italic', `🚩 Bot's active period for this group will expire in ${daysLeft} day(s).`), null, {
                  mentions: participants.map(p => p.id)
               }).then(() => group.lastnotified = daysLeft)
            } else if (daysLeft <= 0) {
               const meta = await this.conn.groupMetadata(jid)
               const participants = this.conn.resolveLid(meta.participants)
               if (data.setting.notifier) {
                  this.conn.reply(jid, Func.texted('italic', `🚩 Bot's active period for this group has expired.`), null, {
                     mentions: participants.map(p => p.id)
                  })
               }
               await this.conn.groupLeave(jid).then(() => delete data.groups[jid])
            }
         }
      } catch (e) {
         if (this.verbose) console.error('[ Notifier ] :', e)
      }
   }

   /**
    * Starts the recurring check for premium and group rent expirations.
    * The check runs immediately once and then repeatedly at the specified interval.
    * @param {number} [recurringIntervalSec=15] - The interval in seconds at which the checks should run.
    */
   start(recurringIntervalSec = 15) {
      const runRecurringTasks = () => this._checkPremiumAndRent()

      runRecurringTasks()
      this.recurringIntervalId = setInterval(runRecurringTasks, recurringIntervalSec * 1000)
      if (this.verbose) console.log(`[ Notifier ] : started, running every ${recurringIntervalSec} seconds.`)
   }

   /**
    * Stops the recurring premium and group rent expiration checks.
    */
   stop() {
      if (this.recurringIntervalId) {
         clearInterval(this.recurringIntervalId)
         this.recurringIntervalId = null
      }
      if (this.verbose) console.log('[ Notifier ] : check stopped.')
   }
}