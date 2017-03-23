const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

module.exports = function(app){

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