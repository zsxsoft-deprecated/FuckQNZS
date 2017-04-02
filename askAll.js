const cp = require('child_process')
const fs = require('fs')
const {PouchDB, dbUrl} = require('./sh/global')
const passwords = fs.readFileSync('./data/accessTokens.txt', 'utf-8').split('\n')
const un = passwords.map(k => k.split(','))
const questionsDB = new PouchDB(dbUrl + 'zhihuQuestions')

;
(async () => {
  const questionSize = (await questionsDB.info()).doc_count
  const range = parseInt(questionSize / un.length)
  for (var w in un) {
    const p = un[w]
    const i = Math.floor(w)
    const b = cp.spawn('node', ['./sh/ask.js', p, i * range, (i + 1) * range])
    b.stdout.on('data', p => process.stdout.write(p))
    b.stderr.on('data', k => console.error(k.toString()))
    await delay(5000)
  }
})()

function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}
