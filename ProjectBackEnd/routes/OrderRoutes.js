const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { createOrder, getAllOrder, getOrderById, updateOrderStatus, getAllOrderOfUser, softDeleteOrder } = require("../controller/orderController");
const router = express.Router();

//GET all order
router.get("/", authenticate, authorize("getAllOrder"), getAllOrder);

//GET orders of specific user
router.get('/user', authenticate, authorize("getAllOrderOfUser"), getAllOrderOfUser);

//GET order by id
router.get("/:id", authenticate, authorize("getOrderById"), getOrderById);

//POST(create) order
router.post('/', authenticate, authorize("createOrder"), createOrder)

//PATCH(update) order status
router.patch("/:id", authenticate, authorize("updateOrderStatus"), updateOrderStatus);

//DELETE order
router.delete("/:id", authenticate, authorize("softDeleteOrder"), softDeleteOrder);

module.exports = router;
