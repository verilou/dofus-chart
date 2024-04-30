"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class NewPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Item, { foreignKey: "itemId", constraints: false });
    }
  }
  NewPrice.init(
    {
      itemId: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      priceBySetOfTen: DataTypes.INTEGER,
      priceBySetOfHundred: DataTypes.INTEGER,
      capitalGain: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "NewPrice",
    },
  );
  return NewPrice;
};
