// controllers/subscriptionController.js

const { Subscription, User } = require('../models');

// =========================================================================
// GET /api/v2/suscripciones (Listar todas las Suscripciones)
// =========================================================================
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            include: [
                { model: User, as: 'User', attributes: ['id', 'email'] } 
            ]
        });

        res.status(200).json(subscriptions);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching subscriptions.', error: error.message });
    }
};

// =========================================================================
// GET /api/v2/suscripciones/:id (Obtener Suscripción por ID)
// =========================================================================
const getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findByPk(id, {
            include: [
                { model: User, as: 'User', attributes: ['id', 'email'] }
            ]
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }

        res.status(200).json(subscription);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching subscription.', error: error.message });
    }
};


// =========================================================================
// POST /api/v2/suscripciones (Crear Suscripción con Validaciones)
// =========================================================================
const createSubscription = async (req, res) => {
    try {
        const { user_id, type, start_date, renewal_date } = req.body; 

        if (!user_id || !type || !start_date || !renewal_date) {
            return res.status(400).json({ 
                message: 'User ID, type, start date, and renewal date are required.' 
            });
        }

        // --- VALIDACIÓN 1: renewal_date > start_date ---
        const start = new Date(start_date);
        const renewal = new Date(renewal_date);

        if (renewal <= start) {
            return res.status(400).json({ 
                message: 'Renewal date must be strictly after the start date.' 
            });
        }

        // --- VALIDACIÓN 2: UNIQUE (user_id, start_date) ---
        const existingSubscription = await Subscription.findOne({
            where: {
                user_id: user_id, 
                start_date: start_date 
            }
        });
        if (existingSubscription) {
            return res.status(400).json({ 
                message: 'A subscription for this user already exists with the same start date.' 
            });
        }
        
        // --- Creación de la Suscripción (Mapeo a campos del modelo) ---
        const newSubscription = await Subscription.create({
            user_id: user_id,
            type: type,
            start_date: start_date,
            renewal_date: renewal_date, // Creo que no hace falta hacer el mapeo de x : x si tienen el mismo nombre pero por las dudas siempre lo hago
        });

        res.status(201).json(newSubscription);

    } catch (error) {
        res.status(500).json({ message: 'Error while creating the subscription.', error: error.message });
    }
};


module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
};