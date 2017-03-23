const express = require('express')
const app = express()
// const bodyParser = require('body-parser')
// const environment = process.env.NODE_ENV || 'development';
// const configuration = require('./knexfile')[environment];
// const database = require('knex')(configuration);

// Controllers 
var readController    = require('./controllers/readController')
var createController  = require('./controllers/createController')
var updateController  = require('./controllers/updateController')
var destroyController = require('./controllers/destroyController')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Backend'
// app.locals.foodList = []

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

// Fire off Controllers
readController(app)
createController(app)
updateController(app)
destroyController(app)

if(!module.parent){
  app.listen(app.get("port"), () => { 
    console.log(`${app.locals.title} is running on port ${app.get('port')}.`)
  })
}

module.exports = app;