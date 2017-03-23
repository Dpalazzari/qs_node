const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

// Controllers 
var readController   = require('./controllers/readController')
var createController = require('./controllers/createController')
var updateController = require('./controllers/updateController')


app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Backend'
// app.locals.foodList = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Fire off Controllers
readController(app)
createController(app)
updateController(app)

app.delete("/api/foods/:name", (req, res) => {
  const name = req.params.name
  if (!name){
    return res.status(503).send({
      error: "Missing name of food to delete"
    })
  }
  database.raw(`DELETE FROM foods WHERE name = ?`, 
  [name]
  ).then(() => {
    res.status(204).json({
      message: "Successfully deleted!"
    })
  })
}) 

if(!module.parent){
  app.listen(app.get("port"), () => { 
    console.log(`${app.locals.title} is running on port ${app.get('port')}.`)
  })
}

module.exports = app;