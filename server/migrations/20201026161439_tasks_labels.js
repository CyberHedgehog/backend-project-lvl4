
exports.up = function(knex) {
  return knex,schema,createTable('tasks_labels', (table) => {
    table.increments('id').primary();
    table.string('taskId');
    table.string('labelId');
  }).then(console.log('Tasks_labels migrated'));
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks_labels');
};
