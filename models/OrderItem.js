const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      onDelete: "CASCADE",
    });
    OrderItem.belongsTo(models.Food, {
      foreignKey: "foodId",
      onDelete: "CASCADE",
    });
  };

  return OrderItem;
};
