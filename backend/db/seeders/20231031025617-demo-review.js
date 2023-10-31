'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Review} = require('../models')

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
   await Review.bulkCreate([ 
    {
        spotId: 1,
        userId: 1,
        review: 'This was an awesome spot',
        stars: 5
    },
    {
        spotId: 2,
        userId: 2,
        review: 'This was an wonderful spot',
        stars: 4
    },
    {
        spotId: 3,
        userId: 3,
        review: 'This was an moderate spot',
        stars: 3
    },
    {
        spotId: 4,
        userId: 4,
        review: 'This was not a good spot',
        stars: 2
    },
    {
        spotId: 5,
        userId: 5,
        review: 'This was an awful spot',
        stars: 1
    }
], {validate: true}).catch(err => {
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
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options)
  }
};
