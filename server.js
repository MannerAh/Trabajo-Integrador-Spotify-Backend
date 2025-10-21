// server.js

// Importo la configuración de la app (Express) desde src/app.js
const app = require('./src/app'); 

// Importo la conexión a la base de datos y la función de conexión del config
// NOTA: No importo 'sequelize' directamente, sino la función de prueba y la instancia.
const { sequelize, connectDB } = require('./src/config/database'); 

// Importo el archivo de asociaciones
// Al importarlo, se ejecutan las llamadas a hasMany/belongsTo definidas en index.js.
// server.js (en la sección de importaciones)

// Desestructurar todos los modelos que dependen de User
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
        // 1. Conexión a la DB
        await connectDB(); 

        // 2. Sincronización de Modelos al fin sin el true lpm
        // Crea las tablas que falten o ajusta las existentes.
        await sequelize.sync(); 
        
        console.log('✅ Modelos de Sequelize sincronizados correctamente.');

        // --- 3. INICIO DEL SERVIDOR WEB (app.listen) ---
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express iniciado y escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error fatal al iniciar la aplicación:', error);
        process.exit(1); 
    }
};

// Llamo a la función para arrancar el servidor
startServer();