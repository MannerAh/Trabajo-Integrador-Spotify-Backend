// routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();

const {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
} = require("../controllers/subscriptionController");

// Rutas de Suscripciones (/api/v2/subscriptions)

// GET /api/v2/subscriptions (Listar todas las Suscripciones)
router.get("/", getAllSubscriptions);

// GET /api/v2/subscriptions/:id (Obtener Suscripción por ID)
router.get("/:id", getSubscriptionById);

// POST /api/v2/subscriptions (Crear Suscripción)
router.post("/", createSubscription);

module.exports = router;