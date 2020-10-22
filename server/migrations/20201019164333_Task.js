
exports.up = function(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.integer('status_id').notNullable();
    table.integer('creator_id').notNullable();
    table.integer('executor_id');
  }).then(console.log('Tasks migrated'))
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
