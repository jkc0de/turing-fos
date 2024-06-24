const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const orderController = require("../controllers/orderController");

router.post(
  "/",
  [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Items must be an array with at least one item"),
    body("items.*.foodId")
      .isInt({ gt: 0 })
      .withMessage("Food ID must be a positive integer"),
    body("items.*.quantity")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Quantity, if provided, must be a positive integer"),
  ],
  orderController.createOrder
);

router.put(
  "/:id",
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Order ID must be a positive integer"),
    body("status")
      .isIn(["pending", "preparing", "ready", "delivered"])
      .withMessage("Invalid status value"),
  ],
  orderController.updateOrderStatus
);

router.get("/", orderController.listOrders);

module.exports = router;
