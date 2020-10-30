
exports.up = function(knex) {
  return knex.schema.createTable('statuses', (table) => {
    table.increments('id').primary();
    table.string('name');
  }).then(console.log('Statuses migrated'))
};

exports.down = function(knex) {
  return knex.schema.dropTable('statuses');
};
