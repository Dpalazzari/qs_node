var pry = require('pryjs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Backend'
app.locals.foodList = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send(app.locals.title)
})

app.get("/api/foods", (req, res) => {
  database.raw(`SELECT * FROM FOODS`)
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
  database.raw(`SELECT * FROM FOODS
  WHERE name=?`, [name])
  .then((food) => {
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
  const foodList = app.locals.foodList
  foodList.splice(findFood(name, foodList), 1)
  res.status(201).json({
    message: "Successfully deleted!"
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
  const foodList = app.locals.foodList
  foodList[findFood(name, foodList)] = food
  res.status(201).json({
    food
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

function findFood(name, foodList){
  for(var i = 0; i < foodList.length; i++){
    if(foodList[i].name === name){return i;}
  }
}

module.exports = app;