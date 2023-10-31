'use strict';

const {Spot} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
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

     await Spot.bulkCreate([
      {
          ownerId: 1,
          address: '444 Washington street',
          city: 'Boston',
          state: 'Massachussets',
          country:  'USA',
          lat: 42.3601 ,
          lng: -71.0589,
          name: 'Sheraton',
          description: 'Place where you relax',
          price: 135
      },
  
      {
          
          ownerId: 2,
          address: '445 Washington street',
          city: 'San Fransisco',
          state: 'California',
          country:  'USA',
          lat: 37.7749 ,
          lng: 122.4194,
          name: 'App Academy',
          description: 'Place where web developers are created',
          price: 136
  
      },
      {
          
          ownerId: 3,
          address: '446 Washington street',
          city: 'Miami',
          state: 'Florida',
          country:  'USA',
          lat: 25.7617 ,
          lng: -80.1918,
          name: 'Havana Club',
          description: 'Place where people dance',
          price: 137
  
      },
      {
          
          ownerId: 4,
          address: '447 Washington street',
          city: 'Chicago',
          state: 'Illinois',
          country:  'USA',
          lat: 41.8827 ,
          lng: -87.6233,
          name: 'Tante Sofie Restaurant',
          description: 'Place where people have dishes',
          price: 138
  
      },
  
      {
          ownerId: 5,
          address: '448 Washington street',
          city: 'Austin',
          state: 'Texas',
          country:  'USA',
          lat: 29.3838 ,
          lng: 94.9027,
          name: 'Texas bar',
          description: 'Place where people drink',
          price: 15
  
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
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options)
  }
};
