module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    description: DataTypes.STRING,
  }, {});
  Task.associate = (models) => {
    Task.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
    Task.belongsTo(models.User, { as: 'assignedUser', foreignKey: 'assignedUserId' });
    Task.belongsToMany(models.Tag, { through: 'TaskTags', as: 'tags' });
    Task.hasOne(models.TaskStatus, { foreignKey: 'taskId' });
  };
  return Task;
};
