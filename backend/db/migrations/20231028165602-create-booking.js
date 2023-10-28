'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : { 
          model : 'Spots',
          key : 'id'
        },
        onDelete : 'CASCADE'
      },
      
      userId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'Users',
          key : 'id'
        },
        onDelete : 'CASCADE'
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull : false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },options);

    await queryInterface.addIndex('Bookings', ['spotId','startDate','endDate'], {
      unique : true
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Bookings', ['spotId','startDate','endDate'])
    options.tableName = "Bookings";
    return queryInterface.dropTable(options);
  }
};