const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

// Controllers 
var readController = require('./controllers/readController')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Backend'
// app.locals.foodList = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Fire off Controllers
readController(app)

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

app.put("/api/foods/edit/:name", (req, res) => {
  const food = req.body.food
  const name = req.params.name
  if (!food){
    return res.status(404).send({
      error: "Missing food attributes"
    })
  }
  database.raw(`UPDATE foods SET name = ?, calories = ? WHERE name = ?`, 
  [food.name, food.calories, name]
  ).then(() => {
    res.sendStatus(201)
  })
})

app.post('/api/foods', (req, res) => {
  const food = req.body.food
  if(!food){
    return res.status(422).send({
      error: 'Missing food property'
    })
  }
  database.raw(`INSERT INTO FOODS (NAME, CALORIES, CREATED_AT) VALUES (?, ?, ?)`, 
  [food.name, food.calories, new Date])
  .then(() => {
    res.sendStatus(201)
  })
})

if(!module.parent){
  app.listen(app.get("port"), () => { 
    console.log(`${app.locals.title} is running on port ${app.get('port')}.`)
  })
}

module.exports = app;