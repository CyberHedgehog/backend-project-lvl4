
exports.up = function(knex) {
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email');
    table.string('password_digest');
    table.string('firstName');
    table.string('lastName');
    table.timeStamp('created_at').defaultTo(knex.fn.now());
    table.timeStamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  knex.schema.dropTable('users');
};
