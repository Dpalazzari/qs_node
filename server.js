const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Food = require('./lib/models/food.js')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Backend'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Controllers 
var readController    = require('./controllers/readController')
var createController  = require('./controllers/createController')
var updateController  = require('./controllers/updateController')
var destroyController = require('./controllers/destroyController')

app.set('port', process.env.PORT || 3000)

// Fire off Controllers
readController(app, bodyParser, Food)
createController(app, bodyParser, Food)
updateController(app, bodyParser, Food)
destroyController(app, bodyParser, Food)

if(!module.parent){
  app.listen(app.get("port"), () => { 
    console.log(`${app.locals.title} is running on port ${app.get('port')}.`)
  })
}

module.exports = app;