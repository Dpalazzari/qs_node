module.exports = function(app, bodyParser, database){

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

  app.delete("/api/foods/:name", (req, res) => {
    const name = req.params.name
    if (!name){
      return res.status(503).send({
        error: "Missing name of food to delete"
      })
    }
    database.raw(`DELETE FROM foods WHERE name = ?`, 
    [name]
    ).then(() => {
      res.status(204).json({
        message: "Successfully deleted!"
      })
    })
  }) 

}