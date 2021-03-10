'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Chat',
        lastName: 'Bot',
        email: 'chat@bot.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Ashutosh',
        lastName: 'Bharti',
        email: 'ashu@bot.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Ankita',
        lastName: '.',
        email: 'ankita@bot.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Rishabh',
        lastName: 'Sagar',
        email: 'rishabh@bot.com',
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
