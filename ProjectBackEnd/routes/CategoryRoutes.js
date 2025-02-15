const express = require("express");
const authMiddleware = require('../middleware/authMiddleware');
const { getAllCategory, updateCategory, getCategoryById, deleteCategory, createCategory } = require("../controller/categoryController");
const router = express.Router();

//GET all category
router.get("/", authMiddleware.authenticate,getAllCategory);

//GET category by id
router.get("/:id", authMiddleware.authenticate,getCategoryById);

//POST category
router.post("/", authMiddleware.authenticate,authMiddleware.authorize("admin", "createCategory"),createCategory);

//PATCH category
router.patch("/:id", authMiddleware.authenticate,authMiddleware.authorize("admin", "updateCategory"), updateCategory);

//DELETE category
router.delete("/:id", authMiddleware.authenticate,authMiddleware.authorize("admin", "deleteCategory"), deleteCategory);

module.exports = router;
