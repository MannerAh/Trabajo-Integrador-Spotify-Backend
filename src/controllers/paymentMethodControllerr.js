// controllers/paymentMethodController.js

const { PaymentMethod, User } = require('../models');
const { Op } = require('sequelize');

// =========================================================================
// GET /api/v2/payment-methods?userId=X (Listar Métodos de Pago)
// =========================================================================
const getAllPaymentMethods = async (req, res) => {
    try {
        const { userId } = req.query; 
        let whereCondition = {};

        if (userId) {
            whereCondition.user_id = userId;
        }

        const methods = await PaymentMethod.findAll({
            where: whereCondition
        });

        res.status(200).json(methods);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching payment methods.', error: error.message });
    }
};

// =========================================================================
// GET /api/v2/payment-methods/:id (Obtener Método de Pago por ID)
// =========================================================================
const getPaymentMethodById = async (req, res) => {
    try {
        const { id } = req.params;

        const method = await PaymentMethod.findByPk(id, {
        });

        if (!method) {
            return res.status(404).json({ message: 'Payment method not found.' });
        }

        res.status(200).json(method);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching payment method.', error: error.message });
    }
};


// =========================================================================
// POST /api/v2/payment-methods (Crear Nuevo Método de Pago)
// =========================================================================
const createPaymentMethod = async (req, res) => {
    try {
        const { type, last_four_digits, user_id } = req.body; 

        if (!type || !last_four_digits || !user_id) {
            return res.status(400).json({ message: 'Type, last four digits, and User ID are required.' });
        }

        const newMethod = await PaymentMethod.create(req.body);

        const responseMethod = { ...newMethod.toJSON() };

        res.status(201).json(responseMethod);

    } catch (error) {
        res.status(500).json({ message: 'Error while creating the payment method.', error: error.message });
    }
};

module.exports = {
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
};