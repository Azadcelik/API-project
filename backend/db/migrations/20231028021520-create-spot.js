'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      address: {
        type: Sequelize.STRING,
        allowNull : false
      },
      city: {
        type: Sequelize.STRING,
        allowNull : false
      },
      state: {
        type: Sequelize.STRING,
        allowNull : false
      },
      country: {
        type: Sequelize.STRING,
        allowNull : false
      },
      lat: {
        type: Sequelize.DECIMAL(9,6),
        allowNull : false
      },
      lng: {
        type: Sequelize.DECIMAL(9,6),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull : false
      },
      description: {
        type: Sequelize.STRING,
        allowNull : false
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP')
        
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.dropTable(options);
  }
};