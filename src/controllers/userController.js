// controllers/userController.js

const { Song, Album, Artist, Genre } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Número de "rondas de sal" para el hasheo de bcrypt
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const saltRounds = 10; 
const PASSWORD_EXPIRY_DAYS = 90;

// =========================================================================
// POST /api/v2/users/register (Registro de Usuario)
// =========================================================================
const registerUser = async (req, res) => {
    try {
        const { email, password, country_id, zipcode, gender, birth_date } = req.body;

        // 1. Validaciones
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // 2. Verificar si el usuario ya existe por email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // 3. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Creación del usuario en la base de datos
        const newUser = await User.create({
            email,
            password: hashedPassword, // Almaceno la contraseña hasheada
            country_id, // FK de cpomtry
            zipcode,
            gender,
            birth_date
        });
        
        // No devuelvo la contraseña
        const userResponse = { 
            id: newUser.id, 
            email: newUser.email
        };

        res.status(201).json({ message: 'User registered successfully.', user: userResponse });

    } catch (error) {
        res.status(500).json({ message: 'Error during user registration.', error: error.message });
    }
};

// =========================================================================
// POST /api/v2/users/login (Login de Usuario)
// Añadir JWT (Token) al login
// =========================================================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // ... (validaciones y búsqueda de usuario) ...

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Carga el 'payload' (datos del usuario que quiero guardar en el token)
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role // Esencial para el control de acceso
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 

        // Devuelve el token en la respuesta
        res.status(200).json({ 
            message: 'Login successful.', 
            user: { id: user.id, email: user.email, username: user.username, role: user.role },
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: 'Error during user login.', error: error.message });
    }
};

// =========================================================================
// GET /api/v2/users/ (Listar todos los usuarios)
// =========================================================================
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // Excluir la columna 'password' y 'pass_updated_at' por seguridad
            attributes: { exclude: ['password', 'pass_updated_at'] } 
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching users.', error: error.message });
    }
};

// =========================================================================
// GET /api/v2/users/:id (Obtener por ID)
// =========================================================================
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching user.', error: error.message });
    }
};

// =========================================================================
// GET /api/v2/users/expired-password (Listar por contraseña vencida)
// =========================================================================
const getUsersWithExpiredPassword = async (req, res) => {
    try {
        // Cálculo de la fecha límite (Hoy - 90 días)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - PASSWORD_EXPIRY_DAYS); 

        const users = await User.findAll({
            where: {
                pass_updated_at: { 
                    [Op.lt]: ninetyDaysAgo // Menor que 90 días
                }
            },
            attributes: ['id', 'email', 'pass_updated_at', 'role'] 
        });

        res.status(200).json({ 
            message: `Found ${users.length} users with passwords older than ${PASSWORD_EXPIRY_DAYS} days.`, 
            users 
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users with expired passwords.', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUsersWithExpiredPassword,
    getUserById,
};