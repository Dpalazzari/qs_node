var pry = require('pryjs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self Backend'
app.locals.foodList = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send(app.locals.title)
})

app.delete("/api/foods/:name", (req, res) => {
  const name = req.params.name
  if (!name){
    return res.status(503).send({
      error: "Missing name of food to delete"
    })
  }
  const foodList = app.locals.foodList
  for(var i = 0; i < foodList.length; i++){
    if(foodList[i].name === name){foodList.splice(i, 1)}
  }
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
  for(var i = 0; i < foodList.length ; i++){
    if(foodList[i].name === name){
      foodList[i] = food;
    }
  }
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
  app.locals.foodList.push(food)
  res.status(201).json({
    food
  })
})

if(!module.parent){
  app.listen(app.get("port"), () => { 
    console.log(`${app.locals.title} is running on port ${app.get('port')}.`)
  })
}
module.exports = app;