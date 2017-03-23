const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

module.exports = function(app){

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

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

}