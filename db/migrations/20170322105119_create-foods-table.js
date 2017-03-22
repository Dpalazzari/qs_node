
exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE FOODS(
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT,
    calories TEXT, 
    created_at TIMESTAMP
  )`;
  return knex.raw(createQuery);
};

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE FOODS`;
  return knex.raw(dropQuery);
};
