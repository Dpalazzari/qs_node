module.exports = function(app, bodyParser, Food){

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

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
}