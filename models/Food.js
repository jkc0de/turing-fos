const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Food = sequelize.define("Food", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  Food.associate = (models) => {
    Food.hasMany(models.OrderItem, {
      foreignKey: "foodId",
      as: "orderItems",
    });
  };

  return Food;
};
