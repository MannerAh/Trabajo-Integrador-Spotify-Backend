// routes/paymentMethodRoutes.js
const express = require("express");
const router = express.Router();

const {
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
} = require("../controllers/paymentMethodControllerr");

// Rutas de Métodos de Pago (/api/v2/payment-methods)

// GET /api/v2/payment-methods?userId=X (Listar Métodos de Pago)
router.get("/", getAllPaymentMethods);

// GET /api/v2/payment-methods/:id (Obtener Método de Pago por ID)
router.get("/:id", getPaymentMethodById);

// POST /api/v2/payment-methods (Crear Nuevo Método de Pago)
router.post("/", createPaymentMethod);

module.exports = router;