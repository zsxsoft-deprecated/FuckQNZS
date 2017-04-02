const PouchDB = require('pouchdb')
const express = require('express')
const path = require('path')
const app = express()
const RealPouchDB = PouchDB.defaults({
  prefix: path.resolve(__dirname, 'data/') + '/'
})

RealPouchDB.debug.enable('*')

app.use('/', require('express-pouchdb')(RealPouchDB))

app.listen(8671)
