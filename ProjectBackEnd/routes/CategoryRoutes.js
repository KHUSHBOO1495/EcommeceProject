const express = require("express");
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getAllCategory, updateCategory, getCategoryById, deleteCategory, createCategory } = require("../controller/categoryController");
const router = express.Router();

//GET all category
router.get("/", authenticate, authorize("getAllCategory"), getAllCategory);

//GET category by id
router.get("/:id", authenticate, authorize("getCategoryById"), getCategoryById);

//POST category
router.post("/", authenticate, authorize("createCategory"), createCategory);

//PATCH category
router.patch("/:id", authenticate, authorize("updateCategory"), updateCategory);

//DELETE category
router.delete("/:id", authenticate, authorize("deleteCategory"), deleteCategory);

module.exports = router;
