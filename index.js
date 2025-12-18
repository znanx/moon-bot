if (process.argv.includes('--server')) require('./server')
require('dotenv').config(), require('rootpath')(), console.clear()
const { spawn: spawn } = require('child_process'), path = require('path'), CFonts = require('cfonts')

process.on('uncaughtException', error => {
   console.error('Uncaught Exception:', error.stack || error)
})
process.on('unhandledRejection', (reason, promise) => {
   console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

function start() {
   let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)]
   let p = spawn(process.argv[0], args, {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
   }).on('message', data => {
      try {
         if (data === 'reset') {
            console.log('Restarting...')
            p.kill()
         }
      } catch (err) {
         console.error('Error handling message:', err)
      }
   }).on('exit', code => {
      console.error('Exited with code:', code)
      if (code !== 0) {
         console.log('Restarting process due to non-zero exit code...')
         start()
      }
   }).on('error', err => {
      console.error('Spawn error:', err)
   })
}

console.clear()
const major = parseInt(process.versions.node.split('.')[0], 10)
if (major < 22) {
   console.error(
      `\n❌ This script requires Node.js 22 to run reliably.\n` +
      `   You are using Node.js ${process.versions.node}.\n` +
      `   Please upgrade to Node.js 22 or higher to proceed.\n`
   )
   process.exit(1)
}

CFonts.say('MOON BOT', {
   font: 'tiny',
   align: 'center',
   colors: ['system']
}), CFonts.say('Github : https://github.com/znanx/moon-bot', {
   colors: ['system'],
   font: 'console',
   align: 'center'
}), start()
