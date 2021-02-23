'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.memberUser = this.belongsTo(models.User, { foreignKey: 'userId' });
      this.memberGroup = this.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  };
  Member.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};