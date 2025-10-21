// server.js

// Importo la configuración de la app (Express) desde src/app.js
const app = require('./src/app'); 

// Importo la conexión a la base de datos y la función de conexión del config
// NOTA: No importo 'sequelize' directamente, sino la función de prueba y la instancia.
const { sequelize, connectDB } = require('./src/config/database'); 

// Importo el archivo de asociaciones
// Al importarlo, se ejecutan las llamadas a hasMany/belongsTo definidas en index.js.
const models = require('./src/models'); 

const PORT = process.env.PORT || 3000; 

/*
  Función principal para iniciar el servidor
  1. Prueba la conexión a la DB.
  2. Sincroniza los modelos con la base de datos.
  3. Inicia la escucha de Express en el puerto definido.
 */
const startServer = async () => {
    try {
        // --- 1. CONEXIÓN A LA BASE DE DATOS ---
        // Llamo a la función que autentica la conexión a MySQL
        await connectDB(); 

        // --- 2. SINCRONIZACIÓN DE MODELOS ---
        // El comando 'sync' verifica si la tabla existe en la base de datos.
        // Si usara { force: true } Borraría y recrearía todas las tablas Uso sync() simple.
        await sequelize.sync({ alter: true }); 
        console.log('✅ Modelos de Sequelize sincronizados correctamente.');

        // --- 3. INICIO DEL SERVIDOR WEB ---
        // Inicio la aplicación Express para que escuche peticiones en el puerto
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express iniciado y escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error fatal al iniciar la aplicación:', error);
        // Termino el proceso si ocurre un error grave (ej. no hay conexión a DB)
        process.exit(1); 
    }
};

// Llamo a la función para arrancar el servidor
startServer();