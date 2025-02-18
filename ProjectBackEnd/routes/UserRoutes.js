const express = require('express');
const {authenticate, authorize } = require('../middleware/authMiddleware');
const { getAllUser, getUserById, updateUser, deleteUser } = require('../controller/userController');
const router = express.Router();

//GET all user
router.get('/', authenticate, authorize("getAllUser"), getAllUser);

//GET user by id
router.get('/:id', authenticate, authorize("getUserById"), getUserById);

//PATCH(update) user
router.patch('/:id', authenticate, authorize("updateUser"),updateUser);

//DELETE user
router.delete('/:id', authenticate, authorize("deleteUser"),deleteUser);

module.exports = router;