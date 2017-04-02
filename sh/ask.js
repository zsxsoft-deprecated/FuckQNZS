const {request, iconv, cheerio, classId, requestHeaders, delay, PouchDB, dbUrl} = require('./global')
const questionsDB = new PouchDB(dbUrl + 'zhihuQuestions')

;(async () => {
  const token = process.argv[2]
  const min = parseInt(process.argv[3])
  const max = parseInt(process.argv[4])
  const urls = (await questionsDB.allDocs({
    include_docs: true,
    limit: max - min,
    skip: min
  })).rows
  for (let id in urls) {
    const question = urls[id].doc
    await request.get(Object.assign({}, requestHeaders, {url: `http://sns.qnzs.youth.cn/?token=${token}`}))
    const askPage = await request.get(Object.assign({}, requestHeaders, {url: `http://sns.qnzs.youth.cn/question/ask/token/${token}/selectedid/${classId}/limit/0`}))
    const $ = cheerio.load(askPage)
    const askData = {
      'ques[token_uid]': iconv.encode($("[name='ques[token_uid]']").val(), 'utf-8'),
      'ques[token_name]': iconv.encode($("[name='ques[token_name]']").val(), 'utf-8'),
      'change_aid': iconv.encode($("[name='change_aid']").val(), 'utf-8'),
      'change_limit': iconv.encode($("[name='change_limit']").val(), 'utf-8'),
      'ques[title]': iconv.encode(question.title, 'utf-8'),
      'tags[]': iconv.encode('青年交流', 'utf-8'),
      'ques[desc]': iconv.encode(question.question, 'utf-8')
    }
    requestHeaders.headers['X-Requested-With'] = 'XMLHttpRequest'
    const saveResult = await request.post(Object.assign({}, requestHeaders, {url: `http://sns.qnzs.youth.cn/ajax/quessave/token/${token}`, form: askData}))
    console.log(`Asked: ${question.title}`, saveResult)
    await delay(6000)
  }
})()
