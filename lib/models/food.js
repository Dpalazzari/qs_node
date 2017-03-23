const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);


function clearFoods(){
  return database.raw('TRUNCATE foods RESTART IDENTITY')
}

function createFood(food){
  return database.raw(
    `INSERT INTO foods (name, calories, created_at) VALUES (?, ?, ?)`,
    [food.name, food.calories, new Date]
  )
}

function showFood(name){
  return database.raw(`SELECT * FROM FOODS
  WHERE name=?`, [name])
}

function indexFood(){
  return database.raw(`SELECT * FROM FOODS`)
}

function updateFood(food, name){
  console.log(food)
  
  return database.raw("UPDATE foods SET "+ food.attrName + " = ? WHERE name = ?", 
  [food.attr, name]
  )
}

function deleteFood(name){
  return database.raw(`DELETE FROM foods WHERE name = ?`, 
  [name]
  )
}

module.exports = {
  destroyAll: clearFoods,
  create: createFood,
  show: showFood,
  index: indexFood,
  update: updateFood,
  delete: deleteFood
}

