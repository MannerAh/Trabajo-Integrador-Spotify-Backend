// routes/seederRoutes.js

const express = require('express');
const router = express.Router();
// Importa la función seedDatabase que creaste
const seederController = require('../controllers/seederController'); 

// La ruta se define como POST, ya que está CREANDO/INSERTANDO datos
router.post('/', seederController.seedDatabase);

module.exports = router;