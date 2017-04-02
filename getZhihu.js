const cp = require('child_process')
const config = require('./config')

;
(async () => {
  for (var i in config.topics) {
    const p = config.topics[i]
    const b = cp.spawn('node', ['./sh/getZhihu.js', `${p}`])
    b.stdout.on('data', p => process.stdout.write(p))
    b.stderr.on('data', k => console.error(k.toString()))
    await delay(1000)
  }
})()

function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}
