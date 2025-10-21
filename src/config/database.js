const { Sequelize, DataTypes } = require('sequelize');

process.loadEnvFile();

const sequelize = new Sequelize(
    process.env.DATABASE, 
    process.env.DBUSER, 
    process.env.DBPASSWORD, 
    {
        host: process.env.DBHOST,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            // Desactiva la pluralización automática de nombres de tabla
            freezeTableName: true 
        }
    }
);

// ----------------------------------------------------
// FUNCIÓN DE PRUEBA DE CONEXIÓN
// ----------------------------------------------------
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos MySQL establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
    }
};

module.exports = { 
    sequelize,
    connectDB 
};