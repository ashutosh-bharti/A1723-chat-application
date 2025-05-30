'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Authenticate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.authUser = this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  Authenticate.init({
    userId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    isLogin: DataTypes.BOOLEAN,
    password: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Authenticate',
  });
  return Authenticate;
};