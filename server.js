const express = require('express')
const app = express()

// Controllers 
var readController    = require('./controllers/readController')
var createController  = require('./controllers/createController')
var updateController  = require('./controllers/updateController')
var destroyController = require('./controllers/destroyController')

app.set('port', process.env.PORT || 3000)

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