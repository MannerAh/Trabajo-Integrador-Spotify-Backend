// config/jwtConfig.js

module.exports = {
    secret: process.env.JWT_SECRET || 'miguelancho420',
    options: {
        expiresIn: '1d'
    }
};