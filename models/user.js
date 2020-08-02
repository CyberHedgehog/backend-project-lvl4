import encrypt from '../lib/secure';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        notEmpty: true,
      },
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Task);
  };
  return User;
};
