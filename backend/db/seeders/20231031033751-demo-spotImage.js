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
          url : 'https://a0.muscache.com/im/pictures/b2ba66fb-e417-4dcd-9cba-f9e9c90adc50.jpg?im_w=720',
          preview: true
      },
      {
          spotId: 2,
          url : 'https://a0.muscache.com/im/pictures/miso/Hosting-948599914350409567/original/8651a5c3-4392-4ce3-8fc1-db908ec26775.jpeg?im_w=720',
          preview: true
      },
      {
          spotId: 3,
          url : 'https://a0.muscache.com/im/pictures/miso/Hosting-948599914350409567/original/07938199-efe8-4e16-a6df-14e015ecf972.jpeg?im_w=720',
          preview: true
      },
      {
          spotId: 4,
          url : 'https://a0.muscache.com/im/pictures/03da3ceb-379a-42f3-8e78-4be520337b7c.jpg?im_w=720',
          preview: true
      },
      {
          spotId: 5,
          url : 'https://a0.muscache.com/im/pictures/miso/Hosting-948599914350409567/original/ad51f4b6-28b6-46fc-8eb2-dfeff61dca56.jpeg?im_w=720',
          preview: true
      }

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
