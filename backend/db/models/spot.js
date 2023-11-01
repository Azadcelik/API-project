'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey : 'ownerId',
        as : 'Owner'
      })

      Spot.belongsToMany(models.User,
        {
          through : models.Booking,
          foreignKey : 'spotId',
          otherKey : 'userId'
        })
        
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete : 'CASCADE'
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey : 'spotId',
        onDelete: 'CASCADE'
      })
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      allowNull : false
    },
    city: {
      type: DataTypes.STRING,
      allowNull : false,
      validate : {
        len :[1,100]
      }
    },
     state: {
        type: DataTypes.STRING,
        allowNull : false,
        validate : {
          len : [1,50]
        }
      },
      country: {
        type: DataTypes.STRING,
        allowNull : false,
        validate : {
          len : [1,100]
        }
      },
      lat: {
        type: DataTypes.DECIMAL(9,6),
        allowNull : false,
        validate : { 
          min : -90,
          max : 90
        }
      },
      lng: {
        type: DataTypes.DECIMAL(9,6),
        allowNull: false,
        validate : { 
          min : -180,
          max : 180
        }
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull : false,
        validate : {
          len : [1,50]
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull : false
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull : false,
        validate : { 
          min : 0
        }
      },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};