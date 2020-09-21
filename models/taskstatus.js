const statuses = ['New', 'In progress', 'On testing', 'Done'];

module.exports = (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
    name: DataTypes.STRING,
    defaultValue: statuses[0],
  }, {});
  TaskStatus.statuses = statuses;
  return TaskStatus;
};
