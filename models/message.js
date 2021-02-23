'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.messageOwner = this.belongsTo(models.User, { foreignKey: 'owner' });
      this.messageTo = this.belongsToMany(models.User, { through: 'UserChats', foreignKey: 'messageId', as: 'messageTo' });
    }
  };
  Message.init({
    text: DataTypes.STRING,
    owner: DataTypes.INTEGER,
    messageFor: DataTypes.STRING,
    isEdited: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};