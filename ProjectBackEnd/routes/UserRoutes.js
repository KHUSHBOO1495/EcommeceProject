const express = require('express');
const {authenticate, authorize } = require('../middleware/authMiddleware');
const { getAllUser, getUserById, updateUser, deleteUser } = require('../controller/userController');

const router = express.Router();

router.get('/', authenticate, authorize("getAllUser"), getAllUser);
router.get('/:id', authenticate, authorize("getUserById"), getUserById);
router.patch('/:id', authenticate, authorize("updateUser"),updateUser);
router.delete('/:id', authenticate, authorize("deleteUser"),deleteUser);

module.exports = router;