'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.chatListUser = this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  ChatList.init({
    userId: DataTypes.INTEGER,
    list: DataTypes.STRING,
    isChatable: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ChatList',
  });
  return ChatList;
};