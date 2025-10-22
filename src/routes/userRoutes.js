// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { 
    registerUser,
    loginUser
} = require('../controllers/userController');

// Rutas de Autenticación y Usuario

// POST /api/v2/users/register
router.post('/register', registerUser);

// POST /api/v2/users/login
router.post('/login', loginUser);

module.exports = router;