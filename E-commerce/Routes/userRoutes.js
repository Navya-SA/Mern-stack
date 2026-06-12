const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, loginUser } = require('../controllers/UserController');

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.patch('/:id/password', changePassword);
router.delete('/:id', deleteUser);

module.exports = router;