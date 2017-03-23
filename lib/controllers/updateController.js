module.exports = function(app, bodyParser, Food){

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.put("/api/foods/edit/:name", (req, res) => {
  const food = req.body.food
  const name = req.params.name
  var attr
  if (!food){
    return res.status(404).send({
      error: "Missing food attributes"
    })
  }
  Food.update(food, name).then(() => {
    res.sendStatus(201)
  })
})

}