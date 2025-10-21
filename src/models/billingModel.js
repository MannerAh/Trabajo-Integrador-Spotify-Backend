// models/billing.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Billing = sequelize.define('Billing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    renewed_times: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    // payment_method_id, user_id y subscription_id serán manejados por las asociaciones
}, {
    tableName: 'billing',
    timestamps: false,
    underscored: true,
});

module.exports = Billing;