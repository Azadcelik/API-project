'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 

          model: 'Spots',
          // schema: options.schema,  // Using schema herea
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 

          model: 'Users',
          // schema: options.schema,  // Using schema here
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      review: {
        type: Sequelize.STRING,
        allowNull : false
      },
      stars: {
        type: Sequelize.INTEGER
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
    },options);

    await queryInterface.addIndex(options, ['spotId', 'userId'], {
      unique: true
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.removeIndex(options, ['spotId', 'userId']);
    return queryInterface.dropTable(options);
  }
};