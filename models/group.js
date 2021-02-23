'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.groupOwner = this.belongsTo(models.User, { foreignKey: 'owner' });
      this.groupMember = this.belongsToMany(models.User, { through: 'Members', foreignKey: 'groupId', as: 'members' });
    }
  };
  Group.init({
    name: DataTypes.STRING,
    owner: DataTypes.INTEGER,
    groupCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};