const { Spam, Config: env } = require('@znan/wabot')

const isSpam = new Spam({
   mode: env.spam.mode,
   messageLimit: env.spam.limit,
   timeWindowSeconds: env.spam.time_window,
   cooldownSeconds: env.spam.time_ban,
   maxBanTimes: env.spam.max_ban,
   commandCooldownSeconds: env.spam.cooldown
})

module.exports = isSpam