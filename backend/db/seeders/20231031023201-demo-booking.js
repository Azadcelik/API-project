'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Booking} = require('../models')


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
   await Booking.bulkCreate([ 
    {
        spotId: 1,
        userId: 1 ,
        startDate: "2021-01-19",
        endDate: "2021-01-20"
    },
    {
        spotId: 2,
        userId: 2 ,
        startDate: "2021-02-19",
        endDate: "2021-02-20"
    },
    {
        spotId: 3,
        userId: 3 ,
        startDate: "2021-03-19",
        endDate: "2021-03-20"
    },
    {
        spotId: 4,
        userId: 4 ,
        startDate: "2021-04-19",
        endDate: "2021-04-20"
    },
    {
        spotId: 5,
        userId: 5 ,
        startDate: "2021-05-19",
        endDate: "2021-05-20"
    },
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
    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options)
  }
};
