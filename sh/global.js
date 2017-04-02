const request = require('request-promise')
const req = require('request')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const zhihu = require('zhihu')
const PouchDB = require('pouchdb')
const config = require('../config')
const dbUrl = 'http://127.0.0.1:8671/'

module.exports = {
  request,
  req,
  iconv,
  cheerio,
  zhihu,
  config,
  classId: config.classId,
  requestHeaders: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    },
    jar: req.jar()
  },
  delay: ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
  PouchDB,
  dbUrl
}
