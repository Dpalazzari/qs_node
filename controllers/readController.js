const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

module.exports = function(app){

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
}