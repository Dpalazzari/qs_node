const express       = require('express')
const app           = express()
const bodyParser    = require('body-parser')
const environment   = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database      = require('knex')(configuration);

// Controllers 
var readController    = require('./controllers/readController')
var createController  = require('./controllers/createController')
var updateController  = require('./controllers/updateController')
var destroyController = require('./controllers/destroyController')

app.set('port', process.env.PORT || 3000)

// Fire off Controllers
readController(app, bodyParser, database)
createController(app, bodyParser, database)
updateController(app, bodyParser, database)
destroyController(app, bodyParser, database)

if(!module.parent){
  app.listen(app.get("port"), () => { 
    console.log(`${app.locals.title} is running on port ${app.get('port')}.`)
  })
}

module.exports = app;