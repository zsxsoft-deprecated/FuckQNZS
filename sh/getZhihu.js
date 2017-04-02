const {request, cheerio, zhihu, delay, dbUrl, PouchDB} = require('./global')
const ent = require('ent')
const questionsDB = new PouchDB(dbUrl + 'zhihuQuestions')
const answersDB = new PouchDB(dbUrl + 'zhihuAnswers')

const getContent = async (url) => {
  const data = await request.get(url)
  const $ = cheerio.load(data, {
    decodeEntities: false
  })
  const answers = []
  try {
    const data = JSON.parse(ent.decode($('#data').attr('data-state'))).entities.answers
    Object.keys(data).forEach(key => {
      const value = data[key]
      answers.push({
        url,
        data: value.content
      })
    })
  } catch (e) {
    console.log('get answers failed', e)
    // do nothing
  }
  answers.push({
    url,
    data: $('.QuestionRichText').html()
  })
  console.log(answers)

  return {
    question: {
      question: $('.QuestionRichText').html(),
      url
    },
    answers
  }
}

;(async () => {
  const topics = await zhihu.Topic.getTopicByID(process.argv[2], 3)
  console.log(`Get ${Object.keys(topics.questions).length} threads from ${process.argv[2]}`)
  for (let id in topics.questions) {
    const question = topics.questions[id]
    const zhihuData = await getContent(question.url)
    try {
      await questionsDB.put(Object.assign({}, {title: question.title, url: question.url, _id: Math.random().toString()}, zhihuData.question))
      await answersDB.bulkDocs([{
        url: question.url,
        _deleted: true
      }])
      await answersDB.bulkDocs(zhihuData.answers)
    } catch (e) {
      console.error(e)
    }
    console.log(`Wrote ${question.url} with ${zhihuData.answers.length} answers to db`)
    delay(1000)
  }
})()
