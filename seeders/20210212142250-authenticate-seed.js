'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Authenticates', [
      {
        username: 'chat@bot.com',
        password: '',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'ashu@bot.com',
        password: 'ashu@123',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'ankita@bot.com',
        password: 'ankita@123',
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'rishabh@bot.com',
        password: 'rishabh@123',
        userId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
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
