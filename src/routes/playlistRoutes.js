// routes/playlistRoutes.js
const express = require("express");
const router = express.Router();

const {
    getAllPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
} = require("../controllers/playlistController");

// Rutas de Playlists (/api/v2/playlists)

// GET /api/v2/playlists (Listar todas las Playlists ACTIVAS)
router.get("/", getAllPlaylists);

// GET /api/v2/playlists/:id (Obtener Playlist por ID con Canciones)
router.get("/:id", getPlaylistById);

// POST /api/v2/playlists (Crear Playlist)
router.post("/", createPlaylist);

// PUT /api/v2/playlists/:id (Actualizar Nombre o Borrado Lógico)
router.put("/:id", updatePlaylist);

// POST /api/v2/playlists/:id/songs (Agregar Canción a Playlist)
router.post("/:id/songs", addSongToPlaylist);

// DELETE /api/v2/playlists/:id/songs/:idSong (Quitar Canción de Playlist)
router.delete("/:id/songs/:idSong", removeSongFromPlaylist);

module.exports = router;