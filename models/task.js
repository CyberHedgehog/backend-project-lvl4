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
    Task.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    Task.belongsTo(models.User, { foreignKey: 'assignedUserId', as: 'assignedTo' });
    Task.belongsTo(models.Tag, { through: 'TaskTags', as: 'tags', foreignKey: 'tagId' });
    Task.hasOne(models.TaskStatus, { foreignKey: 'taskId' });
  };
  return Task;
};
