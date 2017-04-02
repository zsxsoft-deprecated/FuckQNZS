const {request, cheerio, classId, requestHeaders, PouchDB, dbUrl} = require('./sh/global')
const asked = new PouchDB(dbUrl + 'asked')

const fs = require('fs')
const passwords = fs.readFileSync('./data/accessTokens.txt', 'utf-8').split('\n')
const un = passwords.map(k => k.split(','))
;(async () => {
  for (var i in un) {
    const token = un[i]
    const askList = await request.get(Object.assign({}, requestHeaders, {url: `http://sns.qnzs.youth.cn/user/ask/token/${token}/selectedid/${classId}/limit/0`}))
    const $ = cheerio.load(askList)
    $('.question_link').each(function () {
      asked.put({
        _id: Math.random().toString(),
        url: $(this).attr('href')
      })
    })
  }
})()
