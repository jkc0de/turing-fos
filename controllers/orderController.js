const db = require("../models");
const { sequelize } = db;
const { Order, OrderItem, Food } = require("../models");
const { validationResult } = require("express-validator");
const { successResponse, errorResponse } = require("../utils/responseHelper");

// Create Order
const createOrder = async (req, res) => {
  let transaction;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        { message: "Validation errors", errors: errors.array() },
        400
      );
    }
    const { items } = req.body;

    transaction = await sequelize.transaction();

    const totalPrice = await Promise.all(
      items.map(async (item) => {
        const food = await Food.findByPk(item.foodId, { transaction });
        if (!food) throw new Error(`Food with ID ${item.foodId} not found`);
        return (item.quantity || 1) * food.itemPrice;
      })
    ).then((prices) => {
      return prices.reduce((total, price) => total + price, 0);
    });

    const order = await Order.create(
      {
        totalPrice: totalPrice.toFixed(2),
        status: "pending",
      },
      { transaction }
    );

    await Promise.all(
      items.map(async (item) => {
        await OrderItem.create(
          {
            orderId: order.id,
            foodId: item.foodId,
            quantity: item.quantity || 1,
          },
          { transaction }
        );
      })
    );

    await transaction.commit();

    return successResponse(res, order, "Order created successfully", 201);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error creating order:", error);
    return errorResponse(res, error);
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        { message: "Validation errors", errors: errors.array() },
        400
      );
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatusValues = ["pending", "preparing", "ready", "delivered"];
    if (!validStatusValues.includes(status)) {
      return errorResponse(res, { message: "Invalid status value" }, 400);
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return errorResponse(res, { message: "Order not found" }, 404);
    }

    await order.update({ status });
    return successResponse(res, order, "Order status updated successfully");
  } catch (error) {
    console.error("Error updating order status:", error);
    return errorResponse(res, error);
  }
};

// List Orders
const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: "orderItems", include: Food }],
    });
    return successResponse(res, orders, "Orders retrieved successfully");
  } catch (error) {
    console.error("Error listing orders:", error);
    return errorResponse(res, error);
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
  listOrders,
};
