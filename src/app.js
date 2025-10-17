// src/app.js

const express = require('express');
const app = express();

// Importo el archivo principal de rutas (src/routes/index.js)
const mainRouter = require('./routes'); 



// Middleware para el manejo de JSON:
app.use(express.json());

// Middleware para manejar datos codificados en URL (formularios tradicionales)
// Esto es útil si mi cliente va a enviar datos a través de formularios codificados.
app.use(express.urlencoded({ extended: true }));


// ----------------------------------------------------
// CONEXIÓN DE RUTAS
// ----------------------------------------------------

// Conecto todas mis rutas API a través del router principal.
app.use('/api/v1', mainRouter);


// ----------------------------------------------------
// MANEJO DE ERRORES
// ----------------------------------------------------

// Defino un middleware que se ejecuta al final si ninguna ruta anterior coincide.
app.use((req, res, next) => {
    // Si llego aquí, la ruta no existe.
    const error = new Error('Route not found');
    error.status = 404;
    next(error); // Paso el error al siguiente manejador
});

// Defino el manejador de errores final. 
// Captura cualquier error pasado por 'next(error)' o errores internos.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || 'Server error',
        },
    });
});

module.exports = app;