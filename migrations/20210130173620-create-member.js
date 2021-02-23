'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {         // User hasMany Group n:n
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        hooks: true
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {         // Group hasMany User n:n
          model: 'Groups',
          key: 'id'
        },
        onDelete: 'CASCADE',
        hooks: true
      },
      isAdmin: {
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('Members');
  }
};