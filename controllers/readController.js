module.exports = function(app, bodyParser, Food){

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.locals.title = 'Quantified Self Backend'

app.get('/', (req, res) => {
  res.send(app.locals.title)
})

app.get("/api/foods", (req, res) => {
  Food.index().then((foods) => {
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

}