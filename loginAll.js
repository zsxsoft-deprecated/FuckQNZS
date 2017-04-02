const cp = require('child_process')
const fs = require('fs')
const passwords = fs.readFileSync('./config/password.csv', 'utf-8').split('\r\n')
const un = passwords.map(k => k.split(','))

;
(async () => {
  for (var i in un) {
    const p = un[i]
    const b = cp.spawn('node', ['./sh/login.js', `${p[0]}`, `${p[1]}`, `${__dirname}/data/accessTokens.txt`])
    b.stdout.on('data', p => console.log(p.toString()))
    b.stderr.on('data', k => console.error(k.toString()))
    await delay(5000)
  }
})()

function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}
