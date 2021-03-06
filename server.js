const express    = require('express')
const cors       = require('cors')
const app        = express()
const bodyParser = require('body-parser')
const Food       = require('./lib/models/food.js')

var corsOptions = {
  origin:'*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.set('port', process.env.PORT || 3000)

// Controllers 
var readController    = require('./lib/controllers/readController')
var createController  = require('./lib/controllers/createController')
var updateController  = require('./lib/controllers/updateController')
var destroyController = require('./lib/controllers/destroyController')

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