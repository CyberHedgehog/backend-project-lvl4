const statuses = ['new', 'in work', 'on testing', 'done'];

module.exports = (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
    name: DataTypes.STRING,
    defaultValue: statuses[0],
  }, {});
  TaskStatus.statuses = statuses;
  return TaskStatus;
};
