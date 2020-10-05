
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email');
    table.string('password_digest');
    table.string('firstName');
    table.string('lastName');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }).then(console.log('Migrated'));
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
