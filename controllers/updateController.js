const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

module.exports = function(app){

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

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

}