// routes/billingRoutes.js
const express = require("express");
const router = express.Router();

const {
    getAllPayments,
    createPayment
} = require("../controllers/billingController");

// Rutas de Pagos (/api/v2/payments)

// GET /api/v2/payments?user_id=X&desde=Y&hasta=Z (Listar Pagos con Filtros)
router.get("/", getAllPayments);

// POST /api/v2/payments (Registrar Pago)
router.post("/", createPayment);

module.exports = router;