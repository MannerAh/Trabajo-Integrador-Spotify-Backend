// routes/songRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createSong,
    getAllSongs,
    associateGenre,
    disassociateGenre
} = require('../controllers/songController');

//rutas para la gestión de canciones.

// POST /api/v2/songs (crear canciówn)
router.post('/', createSong);                                     

// GET /api/v2/songs (listar con filtros)
router.get('/', getAllSongs);                                      

// POST /api/v2/songs/:songId/genres (Asociar género)
router.post('/:songId/genres', associateGenre);                 

// DELETE /api/v1/canciones/:songId/generos/:genreId (Para quitar un género)
router.delete('/:songId/genres/:genreId', disassociateGenre);       

module.exports = router;