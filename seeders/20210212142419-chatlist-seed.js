'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ChatLists', [
      {
        userId: 2,
        list: 'g1',
        isChatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        list: 'u3',
        isChatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        list: 'u4',
        isChatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        list: 'g1',
        isChatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        list: 'u2',
        isChatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        list: 'u4',
        isChatable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        list: 'g1',
        isChatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        list: 'u2',
        isChatable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
