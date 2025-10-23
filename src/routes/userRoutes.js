// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { 
    registerUser,
    loginUser,
    getAllUsers,    
    getUserById,    
    getUsersWithExpiredPassword ,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

// middleware de autenticación
const authenticateToken = require('../middlewares/auth');

// Rutas de Autenticación (Públicas)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rutas de CRUD/Administración (PROTEGIDAS)

router.delete('/:id', authenticateToken, deleteUser);

router.put('/:id', authenticateToken, updateUser);

router.get('/', authenticateToken, getAllUsers); 
router.get('/expired-password', authenticateToken, getUsersWithExpiredPassword); 
router.get('/:id', authenticateToken, getUserById); 

module.exports = router;