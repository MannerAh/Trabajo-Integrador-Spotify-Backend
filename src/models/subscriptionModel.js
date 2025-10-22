// models/subscription.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING(9),
        allowNull: false,
    },
    // Clave Foránea (Foreign Key)
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    start_date: {
        type: DataTypes.DATE, 
        allowNull: true,
    },
    renewal_date: {
        type: DataTypes.DATE, 
        allowNull: true,
    }
}, {
    tableName: 'subscription',
    timestamps: true,
    createdAt: 'create_time', // Mapea create_time a createdAt
    updatedAt: 'update_time', // Mapea update_time a updatedAt
    underscored: true, 
});

module.exports = Subscription;