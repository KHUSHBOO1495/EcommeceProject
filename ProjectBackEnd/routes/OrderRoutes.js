const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { getAllOrder, getOrderById, updateOrderStatus, getAllOrderOfUser, softDeleteOrder, createOrderFromCart, createSingleOrder } = require("../controller/orderController");
const router = express.Router();

//GET all order
router.get("/", authenticate, authorize("getAllOrder"), getAllOrder);

//GET orders of specific user
router.get('/user', authenticate, authorize("getAllOrderOfUser"), getAllOrderOfUser);

//GET order by id
router.get("/:id", authenticate, authorize("getOrderById"), getOrderById);

//POST(create) order from cart
router.post('/cart', authenticate, authorize("createOrderFromCart"), createOrderFromCart)

//POST(create) single order
router.post('/', authenticate, authorize("createSingleOrder"), createSingleOrder)

//PATCH(update) order status
router.patch("/:id", authenticate, authorize("updateOrderStatus"), updateOrderStatus);

//DELETE order
router.delete("/:id", authenticate, authorize("softDeleteOrder"), softDeleteOrder);

module.exports = router;
