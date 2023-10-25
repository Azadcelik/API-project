'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING(30),
      allowNull : false,
      unique : true,
      validate : {
        len : [4,30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }

    },
    email: {
      type: DataTypes.STRING(256),
      allowNull : false,
      unique : true,
      validate: { 
        len : [3,256],
        isEmail : true
      }
    },
    hashedPassword: {
    type : DataTypes.STRING,
    allowNull : false,
    validate : {
      min : 60,
      max : 60  
    }
  
  }
  }, {
    sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};