const assert = require('chai').assert
const app = require('../server')
const request = require('request')

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

  it('should exist', () => {
    assert(app)
  })

  describe("POST /api/foods", () => {
    beforeEach(() => {
      app.locals.foodList = []
    })

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
        if(err){done(err)}
        const foodCount = app.locals.foodList.length
        assert.equal(foodCount, 1)
        done()
      })
    }) 
  })

  describe("PUT /api/foods/edit/:name", () => {
    beforeEach(() => {
      app.locals.foodList = [{name: "Drew", calories: "1000000"}]
    })
    it("returns a 404 given invalid attributes", (done) => {
      this.request.put("/api/foods/edit/:name", (err, res) => {
        if(err){done(err)}
        assert.equal(res.statusCode, 404)
        done()
      })
    })

    it("updates a specific foods attributes", (done) => {
      const food = {food: {name: 'pineapple', calories: '300'}}
      this.request.put("/api/foods/edit/Drew", { form: food}, (err, res) => {
        if(err){done(err)}
        const foodList = app.locals.foodList
        assert.equal(foodList.length, 1)
        assert.equal(foodList[0].name, "pineapple")
        assert.equal(foodList[0].calories, "300")
        done()
      })
    })
  })

  describe("DELETE /api/foods/:name", () => {
    beforeEach(() => {
      app.locals.foodList = [{name: "David", calories: "300"}]
    })
    it ("removes a given food", (done) => {
      var foodList = app.locals.foodList
      assert.equal(foodList.length, 1)
      this.request.delete("/api/foods/David", (err, res) => {
        if(err){done(err)}
        foodList = app.locals.foodList
        assert.equal(foodList.length, 0)
        done()
      })
    })
  })
})