
exports.up = function(knex) {
  return knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name');
  }).then(console.log('Labels migrated'));
};

exports.down = function(knex) {
  return knex.schema.dropTable('labels');
};
