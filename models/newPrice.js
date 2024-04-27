"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class newPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.item);
    }
  }
  newPrice.init(
    {
      itemId: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      priceBySetOfTen: DataTypes.INTEGER,
      priceBySetOfHundred: DataTypes.INTEGER,
      capitalGain: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "newPrice",
    },
  );
  return newPrice;
};
