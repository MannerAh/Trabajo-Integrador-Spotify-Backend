// controllers/pagosController.js

const { Billing, User, Subscription, PaymentMethod } = require('../models');
const { Op } = require('sequelize');

// =========================================================================
// GET /api/v2/pagos?user_id=X&desde=Y&hasta=Z (Listar Pagos con Filtros)
// =========================================================================
const getAllPayments = async (req, res) => {
    try {
        const { user_id, desde, hasta } = req.query; 
        let whereCondition = {};

        if (user_id) {
            whereCondition.user_id = user_id;
        }

        if (desde || hasta) {
            whereCondition.date = {};
            if (desde) {
                whereCondition.date[Op.gte] = desde; 
            }
            if (hasta) {
                whereCondition.date[Op.lte] = hasta; 
            }
        }
        
        const payments = await Billing.findAll({
            where: whereCondition,
            include: [
                { model: User, as: 'User', attributes: ['id', 'email'] },
                { model: Subscription, as: 'Subscription', attributes: ['id', 'type'] },
                { model: PaymentMethod, as: 'PaymentUsed', attributes: ['id', 'last_four_digits'] }
            ]
        });

        res.status(200).json(payments);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching payments.', error: error.message });
    }
};

// =========================================================================
// POST /api/v2/pagos (Registrar Pago)
// =========================================================================
const createPayment = async (req, res) => {
    try {
        const { user_id, subscription_id, payment_method_id, amount } = req.body; 

        if (!user_id || !subscription_id || !payment_method_id || !amount) {
            return res.status(400).json({ 
                message: 'User ID, Subscription ID, Payment Method ID, and amount are required.' 
            });
        }
        
        const paymentData = {
            ...req.body, // Trae todos los demás campos
            // Si req.body.date no existe o es falsy, usa la fecha actual (AAAA-MM-DD)
            date: req.body.date || new Date().toISOString().split('T')[0], 
            renewed_times: req.body.renewed_times || 1,
        };
        
        newPayment = await Billing.create(paymentData);

        res.status(201).json(newPayment);

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                message: 'Invalid Subscription ID or Payment Method ID provided.', 
                error: error.message
            });
        }
        res.status(500).json({ message: 'Error while registering the payment.', error: error.message });
    }
};


module.exports = {
    getAllPayments,
    createPayment 
};