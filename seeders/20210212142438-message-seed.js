'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Messages', [
      {
        text: 'Welcome to Chat!',
        owner: 1,
        messageFor: 'u1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Let Start Chat!',
        owner: 1,
        messageFor: 'u1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Ankita joined the group.',
        owner: 1,
        messageFor: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Rishabh joined the group.',
        owner: 1,
        messageFor: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Hii everyone',
        owner: 2,
        messageFor: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Hii ashu',
        owner: 3,
        messageFor: 'g1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Hii ankita',
        owner: 2,
        messageFor: 'u3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Hii',
        owner: 3,
        messageFor: 'u2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Hii rishabh',
        owner: 2,
        messageFor: 'u4',
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
