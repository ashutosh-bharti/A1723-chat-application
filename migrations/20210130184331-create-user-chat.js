'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserChats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {         // User hasMany Message n:n
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        hooks: true
      },
      messageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {         // Message hasMany User n:n
          model: 'Messages',
          key: 'id'
        },
        onDelete: 'CASCADE',
        hooks: true
      },
      list: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserChats');
  }
};