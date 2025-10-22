// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { 
    registerUser,
    loginUser,
    getAllUsers,
    getUsersWithExpiredPassword,
    getUserById
} = require('../controllers/userController');

// Rutas de Autenticación y Usuario

// POST /api/v2/users/register
router.post('/register', registerUser);

// POST /api/v2/users/login
router.post('/login', loginUser);

// GET /api/v2/users
router.get('/', getAllUsers);

// GET /api/v2/users/:id
router.get('/:id', getUserById);

// GET /api/v2/users/expired-password
router.get('/expired-password', getUsersWithExpiredPassword);

module.exports = router;