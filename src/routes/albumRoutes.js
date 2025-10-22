// routes/albumRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getAllAlbums,
    createAlbum,
    getAlbumById,
    getAlbumSongs,
    updateAlbum,
    deleteAlbum
} = require('../controllers/albumController');

// Rutas de Álbumes (/api/v2/albumes)

// GET /api/v2/albumes?artistaId=X&q=Y (Listar y Filtrar)
router.get('/', getAllAlbums);          

// POST /api/v2/albumes (Crear nuevo álbum con validación UNIQUE)
router.post('/', createAlbum);          

// GET /api/v2/albumes/:id (Obtener álbum por ID con detalles y canciones)
router.get('/:id', getAlbumById);       

// GET /api/v2/albumes/:id/songs (Obtener SOLO la lista de canciones)
router.get('/:id/songs', getAlbumSongs); 

// PUT /api/v2/albumes/:id (Actualizar álbum)
router.put('/:id', updateAlbum);        

// DELETE /api/v2/albumes/:id (Eliminar álbum)
router.delete('/:id', deleteAlbum);     

module.exports = router;