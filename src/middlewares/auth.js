// src/middlewares/auth.js

const jwt = require('jsonwebtoken');

// Mi clave secreta (debe coincidir con la de userController.js)
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware para verificar el JWT
const authenticateToken = (req, res, next) => {
    // 1. Obtener el token del header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtiene solo el <token>

      // DEBUG: loguear header/token para depuración
    console.log('[auth] Authorization header:', authHeader);
    console.log('[auth] Extracted token:', token ? token.slice(0, 20) + '...' : token);
    
    // 2. Si no hay token, acceso denegado
    if (token == null) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 3. Verificar el token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        
        req.user = user; 
        
        // Continuar con la ejecución de la ruta
        next();
    });
};

module.exports = authenticateToken;