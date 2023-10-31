'use strict';

/** @type {import('sequelize-cli').Migration} */

const {ReviewImage} = require('../models')
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
   await ReviewImage.bulkCreate([ 
    {
       reviewId: 1,
       url: 'image url'
   
    },
    {
       reviewId: 2,
       url: 'image url'
   
    },
    {
       reviewId: 3,
       url: 'image url'
   
    },
    {
       reviewId: 4,
       url: 'image url'
   
    },
    {
       reviewId: 5,
       url: 'image url'
   
    }],{validate: true}).catch(err => { 
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
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options)
  }
};
