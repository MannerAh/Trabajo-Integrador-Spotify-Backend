/**
 * Rutas para géneros
 * Los estudiantes deben implementar todas las rutas relacionadas con géneros
 */
// routes/genreRoutes.js

const express = require("express");
const router = express.Router();

const {
    getAllGenres,
    createGenre
} = require("../controllers/genreController");

// Rutas de Géneros (/api/v2/genres)

// GET /api/v2/genres (Listar toddos)
router.get("/", getAllGenres);

// POST /api/v2/genres (Crear nuevo género)
router.post("/", createGenre);

module.exports = router;