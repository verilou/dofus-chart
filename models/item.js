"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.NewPrice, {
        foreignKey: "itemId",
        constraints: false,
      });
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      ankamId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
    },
  );
  return Item;
};
