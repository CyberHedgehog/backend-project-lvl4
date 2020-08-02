module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING,
  }, {});
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Task, { through: 'TaskTags', as: 'tasks', foreignKey: 'tagId' });
  };
  return Tag;
};
