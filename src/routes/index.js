// routes/index.js

const express = require("express");
const router = express.Router();

// ===== USUARIOS =====
const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);
// ===== ARTISTAS =====
const artistRoutes = require('./artistRoutes');
router.use('/artists', artistRoutes);

// ===== ALBUMES =====
const albumRoutes = require('./albumRoutes');
router.use('/albums', albumRoutes);

// ===== CANCIONES =====
const songRoutes = require('./songRoutes');
router.use('/songs', songRoutes);

// router.use('/generos', generosRoutes);

// router.use('/playlists', playlistsRoutes);
// router.use('/suscripciones', suscripcionesRoutes);

// router.use('/metodos-pago', metodosPagoRoutes);
// router.use('/pagos', pagosRoutes);
// router.use('/vistas', vistasRoutes);
router.use('/seed', require('./seederRoutes'));

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({
    message: "API Spotify - Backend funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      usuarios: "/api/v1/usuarios",
      artistas: "/api/v1/artistas",
      albumes: "/api/v1/albumes",
      canciones: "/api/v1/canciones",
      generos: "/api/v1/generos",
      playlists: "/api/v1/playlists",
      suscripciones: "/api/v1/suscripciones",
      metodosPago: "/api/v1/metodos-pago",
      pagos: "/api/v1/pagos",
      vistas: "/api/v1/vistas",
    },
  });
});

module.exports = router;
