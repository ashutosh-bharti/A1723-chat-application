'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

      // UserChat.state:(null: sent | false: delivered | true: seen)

      static associate(models) {
      // define association here
      this.userChatUser = this.belongsTo(models.User, { foreignKey: 'userId' });
      this.userChatMessage = this.belongsTo(models.Message, { foreignKey: 'messageId' });
    }
  };
  UserChat.init({
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
    list: DataTypes.STRING,
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserChat',
  });
  return UserChat;
};