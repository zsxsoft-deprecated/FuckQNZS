const {request} = require('./global')
const fs = require('fs')
const io = require('socket.io-client')
let isDebugging = false

function sha1 (string) {
  let p = require('crypto').createHash('sha1')
  p.update(string)
  return p.digest('hex')
}

function rc4Encrypt (key, pt) {
  let s = []
  for (var i = 0; i < 256; i++) {
    s[i] = i
  }
  var j = 0
  var x
  for (i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256
    x = s[i]
    s[i] = s[j]
    s[j] = x
  }
  i = 0
  j = 0
  var ct = ''
  for (var y = 0; y < pt.length; y++) {
    i = (i + 1) % 256
    j = (j + s[i]) % 256
    x = s[i]
    s[i] = s[j]
    s[j] = x
    ct += String.fromCharCode(pt.charCodeAt(y) ^ s[(s[i] + s[j]) % 256])
  }
  return ct
}

async function login (username, password) {
  const loginServerText = await request({
    url: 'http://weibang.youth.cn/public/web/service/webmanager/dispatchByWebBrowser',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `host=weibang.youth.cn&port=80&username=${username}`
  })
  const loginServer = JSON.parse(JSON.parse(loginServerText))
  const accessText = await request({
    url: 'http://weibang.youth.cn/public/web/service/webmanager/login_safe',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      httphost: loginServer.data.httphost,
      httpport: loginServer.data.httpport,
      username: rc4Encrypt('h8uJk2U8ew9H17ycbN6gH0c8Lmn6Ko2p', username),
      password: sha1(password),
      device_token: '',
      socketType: 'websocketio',
      version: ''
    }
  })
  const accessData = JSON.parse(JSON.parse(accessText))
  if (accessData.code !== '200') {
    throw accessText
  }
  const accessToken = accessData.data.access_token
  return new Promise((resolve, reject) => {
    const socket = io.connect(`http://${accessData.data.host}:${accessData.data.port}`)
    let step = 1
    function doStep () {
      switch (step) {
        case 1:
          socket.emit('message', JSON.stringify({
            'id': step,
            'route': 'connector.entryHandler.connect',
            'msg': {
              'uid': accessData.data.uid,
              'username': username,
              'token': accessData.data.access_token,
              'version': '',
              'sockettype': 'websocketio',
              'device_type': '4',
              'device_token': '',
              'unit_type': 'web'
            }
          }))
          break
        case 2:
          socket.emit('message', JSON.stringify({
            'id': step,
            'route': 'api.qnzsUserHandler.getQnzsChildUrl',
            'msg': {
              'my_uid': accessData.data.uid,
              'share_url': 'http://sns.qnzs.youth.cn/?token=',
              'token': accessToken
            }
          }))
          break
      }
    }
    socket.on('message', m => {
      if (isDebugging) console.log('Received: ', m)
      const w = JSON.parse(m)
      if (w.body.data && w.body.data.url) {
        resolve(w.body.data.url)
        socket.disconnect()
        return
      }
      step++
      doStep()
    })
    socket.on('connect', () => {
      doStep()
    })
  })
}

; (async () => {
  if ('--debug' in process.argv) {
    isDebugging = true
  }
  try {
    const url = await login(process.argv[2], process.argv[3])
    const token = url.split('token=')[1]
    fs.appendFileSync(process.argv[4], token + '\n')
    console.log('Login succeed:', process.argv[2])
    process.exit(0)
  } catch (e) {
    console.error('Login failed:', process.argv[2])
    console.error(e.toString())
    process.exit(1)
  }
})()
