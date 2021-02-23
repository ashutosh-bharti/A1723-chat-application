'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.userAuth = this.hasOne(models.Authenticate);
      this.userChatList = this.hasMany(models.ChatList);
      this.userGroupOwner = this.hasMany(models.Group, { as: 'groupOwner' });
      this.userGroupMember = this.belongsToMany(models.Group, { through: 'Members', foreignKey: 'userId', as: 'groupMember' });
      this.userMessageOwner = this.hasMany(models.Message, { as: 'messageOwner' });
      this.userMessages = this.belongsToMany(models.Message, { through: 'UserChats', foreignKey: 'userId', as: 'userMessages' });
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};