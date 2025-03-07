const express = require("express");
const { getAllProduct, getProductById, updateProduct, createProduct, deleteProduct } = require("../controller/productController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

//GET all products
router.get("/", authenticate, authorize("getAllProduct"),  getAllProduct);

//GET product by id
router.get("/:id", authenticate, authorize("getProductById"), getProductById);

//POST product
router.post("/", authenticate, authorize("createProduct"), createProduct);

//PATCH(update) product
router.patch("/:id", authenticate, authorize("updateProduct"), updateProduct);

//DELETE product
router.delete("/:id", authenticate, authorize("updateProduct"), deleteProduct);

module.exports = router;
