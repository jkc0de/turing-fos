const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "preparing", "ready", "delivered"),
      allowNull: false,
      defaultValue: "pending",
    },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "orderItems",
    });
  };

  return Order;
};
