const {request, iconv, cheerio, requestHeaders, delay, PouchDB, dbUrl} = require('./global')
const zhihuAnswersDB = new PouchDB(dbUrl + 'zhihuAnswers')
const askedDB = new PouchDB(dbUrl + 'asked')

;(async () => {
  const token = process.argv[2]
  const min = parseInt(process.argv[3])
  const max = parseInt(process.argv[4])
  const answerLength = (await zhihuAnswersDB.info()).doc_count
  await request.get(Object.assign({}, requestHeaders, {url: `http://sns.qnzs.youth.cn/?token=${token}`}))

  const urls = (await askedDB.allDocs({
    include_docs: true,
    limit: max - min,
    skip: min
  })).rows

  for (let id in urls) {
    const value = urls[id]
    const asked = value.doc.url
    const answer = (await zhihuAnswersDB.allDocs({
      include_docs: true,
      limit: 1,
      skip: Math.floor(Math.random() * answerLength)
    })).rows[0].doc

    const askPage = await request.get(Object.assign({}, requestHeaders, {url: 'http://sns.qnzs.youth.cn' + asked.replace(/\/token\/.*?\//, `/token/${token}/`)}))
    const $ = cheerio.load(askPage)
    const askData = {
      'answer[qid]': asked.match(/\/index\/show\/id\/(\d*?)\//)[1], // iconv.encode($("[name='answer[qid]']").val(), 'utf-8'),
      'change_aid': iconv.encode($("[name='change_aid']").val(), 'utf-8'),
      'change_limit': iconv.encode($("[name='change_limit']").val(), 'utf-8'),
      'answer[content]': iconv.encode(answer.data, 'utf-8')
    }
    console.log(askData)
    console.log(answer.data)
    requestHeaders.headers['X-Requested-With'] = 'XMLHttpRequest'
    const saveResult = await request.post(Object.assign({}, requestHeaders, {url: `http://sns.qnzs.youth.cn/ajax/anssave/token/${token}`, form: askData}))
    const obj = JSON.parse(saveResult)
    console.log(`Answered: ${JSON.stringify(obj)}`)
    await delay(21000) // 青年之声答题限制20秒一次
  }
})()
