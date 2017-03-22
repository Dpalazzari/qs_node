exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE foods RESTART IDENTITY')
  .then(() => {
    return Promise.all([
      knex.raw(
        'INSERT INTO FOODS (name, calories, created_at) VALUES (?, ?, ?)',
        ["Banana", "50", new Date]
      ),
      knex.raw(
        'INSERT INTO FOODS (name, calories, created_at) VALUES (?, ?, ?)',
        ["Drew", "1000", new Date]
      ),
      knex.raw(
        'INSERT INTO FOODS (name, calories, created_at) VALUES (?, ?, ?)',
        ["Cow", "100", new Date]
      )
    ]);
  });
};

