// models/payment_method.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    last_four_digits: {
        type: DataTypes.STRING(4),
        allowNull: false,
    },
    expiration_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    token: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    // user_id será manejado por la asociación
}, {
    tableName: 'payment_method',
    timestamps: false,
    underscored: true,
});

module.exports = PaymentMethod;