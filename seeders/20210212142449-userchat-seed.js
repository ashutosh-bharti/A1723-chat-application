'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('UserChats', [
      {
        userId: 2,
        messageId: 1,
        list: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        messageId: 1,
        list: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 3,
        list: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        messageId: 1,
        list: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 4,
        list: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        messageId: 4,
        list: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 5,
        list: 'g1',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        messageId: 5,
        list: 'g1',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        messageId: 5,
        list: 'g1',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        messageId: 6,
        list: 'g1',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 6,
        list: 'g1',
        state: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        messageId: 6,
        list: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 2,
        list: 'u3',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 7,
        list: 'u3',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        messageId: 7,
        list: 'u2',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        messageId: 8,
        list: 'u2',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 8,
        list: 'u3',
        state: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 2,
        list: 'u4',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        messageId: 9,
        list: 'u4',
        state: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        messageId: 9,
        list: 'u2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        messageId: 2,
        list: 'u4',
        state: true,
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
