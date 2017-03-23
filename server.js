var pry = require('pryjs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const environment = process.env.NODE_ENV || 'development';
// const configuration = require('./knexfile')[environment];
// const database = require('knex')(configuration);
const Food = require('./lib/models/food.js')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Backend'
app.locals.foodList = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send(app.locals.title)
})

app.get("/api/foods", (req, res) => {
  Food.index()
  .then((foods) => {
    if(!foods.rowCount){
      return res.status(404).send({
      error: "Food does not exist"
    })
  }
  res.status(200).json(foods.rows)
  })
})

app.get("/api/foods/:name", (req, res) => {
  const name = req.params.name
  Food.show(name).then((food) => {
    if (!food.rowCount){
      return res.status(404).send({
        error: "Food does not exist"
      })
    }
    res.status(200).json(food.rows[0])
  })
})

app.delete("/api/foods/:name", (req, res) => {
  const name = req.params.name
  if (!name){
    return res.status(503).send({
      error: "Missing name of food to delete"
    })
  }
  Food.delete(name).then(() => {
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
  Food.update(food, name).then(() => {
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
  Food.create(food).then(() => {
    res.sendStatus(201)
  })
})

if(!module.parent){
  app.listen(app.get("port"), () => { 
    console.log(`${app.locals.title} is running on port ${app.get('port')}.`)
  })
}

function findFood(name, foodList){
  for(var i = 0; i < foodList.length; i++){
    if(foodList[i].name === name){return i;}
  }
}

module.exports = app;