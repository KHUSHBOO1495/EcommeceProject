const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getAllUser, getUserById, updateUser, deleteUser } = require('../controller/userController');

const router = express.Router();

router.get('/', authMiddleware.authenticate, authMiddleware.authorize("admin", "getAllUser"), getAllUser);
router.get('/:id', authMiddleware.authenticate, authMiddleware.authorize("admin", "getUserById"), getUserById);
router.patch('/:id', authMiddleware.authenticate, updateUser);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize("admin","deleteUser"),deleteUser);

module.exports = router;