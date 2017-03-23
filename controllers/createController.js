module.exports = function(app, bodyParser, database){

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