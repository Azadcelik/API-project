'use strict';

/** @type {import('sequelize-cli').Migration} */

const {SpotImage} = require('../models')


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await SpotImage.bulkCreate([
      {
          spotId: 1,
          url : 'image url',
          preview: true
      },
      {
          spotId: 2,
          url : 'image url',
          preview: true
      },
      {
          spotId: 3,
          url : 'image url',
          preview: true
      },
      {
          spotId: 4,
          url : 'image url',
          preview: false
      },
      {
          spotId: 5,
          url : 'image url',
          preview: true
      },
  ],{validate: true}).catch(err => { 
    console.log(err)
    throw err
  })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options)
  }
};
