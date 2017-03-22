const assert = require('chai').assert
const app = require('../server')
const request = require('request')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  before(done => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, res)=> {
      if(err){done(err)}
      done()
    })
    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close()
  })

  beforeEach((done) => {
    database.raw(
      `INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)`,
      ["babooshka", "1000", new Date]
    ).then(() => done())
    .catch(done);
  })

  beforeEach((done) => {
    database.raw(
      `INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)`,
      ["cow", "100", new Date]
    ).then(() => done())
    .catch(done);
  })

  afterEach((done) => {
    database.raw(`TRUNCATE foods RESTART IDENTITY`)
    .then(() => done());
  })

  describe("GET /api/foods/:name", () => {
    it ("returns a 404 status if food name is missing", (done) => {
      this.request.get("/api/foods/cowturds", (err, res) => {
        if(err){done(err)}
        assert.equal(res.statusCode, 404)
        done()
      })
    })

    it ("returns a food given its name", (done) => {
      this.request.get("/api/foods/babooshka", (err, res) => {
        if(err){done(err)}
        const id = 1
        const name = "babooshka"
        const calories = "1000"

        let parsedFood = JSON.parse(res.body)
        assert.equal(parsedFood.id, id)
        assert.equal(parsedFood.name, name)
        assert.equal(parsedFood.calories, calories)
        done()
      })
    })
  })

  it('should exist', () => {
    assert(app)
  })

  describe("POST /api/foods", () => {

    it("returns a 422 status code given invalid attributes", (done) => {
      this.request.post("/api/foods", (err, res) => {
        if(err){done(err)}
        assert.equal(res.statusCode, 422)
        done()
      })
    })

    it('creates a food object', (done) => {
      const food = {food: {name: 'pineapple', calories: '300'}}
      this.request.post('/api/foods', { form: food}, (err, res) => {
        const name = 'pineapple'
        const calories = '300'
        if(err){done(err)}
        database.raw(`SELECT * FROM FOODS`)
        .then((foods) => {
          if(!foods){
            done(err)
          }
          assert.equal(foods.rowCount, 3)
          assert.equal(foods.rows[2].name, name)
          done()
        })
      })
    }) 
  })

  describe("PUT /api/foods/edit/:name", () => {
    it("returns a 404 given invalid attributes", (done) => {
      this.request.put("/api/foods/edit/:name", (err, res) => {
        if(err){done(err)}
        assert.equal(res.statusCode, 404)
        done()
      })
    })

    it("updates a specific foods attributes", (done) => {
      const food = {food: {name: 'pineapple', calories: '300'}}
      this.request.put("/api/foods/edit/babooshka", { form: food}, (err, res) => {
        if(err){done(err)}
        const name = "pineapple"
        const calories = "300"
        assert.equal(res.statusCode, 201)
        database.raw(`SELECT * FROM foods WHERE name = ?`, 
        [name]
        ).then((foods) => {
          var foodObject = foods.rows[0]
          assert.equal(foodObject.name, 'pineapple')
          assert.equal(foodObject.calories, "300")
        }).then(() => {
          database.raw(`SELECT * FROM foods WHERE name = ?`, 
        ["babooshka"]
        ).then((foods) => {
          assert.equal(foods.rows[0], undefined)
          done()
        })
        })
      })
    })
  })

  describe("DELETE /api/foods/:name", () => {
    it ("removes a given food", (done) => {
      this.request.delete("/api/foods/cow", (err, res) => {
        if(err){done(err)}
        assert.equal(res.statusCode, 204)
        database.raw(`SELECT * FROM FOODS`)
        .then((foods) => {
          console.log(foods.rows)
          assert.equal(foods.rows.length, 1)
          done()
        })
      })
    })
  })

  describe("GET /api/foods", () => {
    it("returns json of all foods in foodList", (done) => {
      this.request.get("/api/foods", (err, res) => {
        const idFirst  = 1
        const idSecond = 2
        const foodOne  = 'cow'
        const foodTwo  = 'babooshka'
        if(err){done(err)}
        var parsedFoods = JSON.parse(res.body)
        assert.equal(parsedFoods[0].id, idFirst)
        assert.equal(parsedFoods[1].id, idSecond)
        assert.equal(parsedFoods[0].name, foodTwo)
        assert.equal(parsedFoods[1].name, foodOne)
        assert.equal(parsedFoods.length, 2)
        done()
      })
    })
  })
})