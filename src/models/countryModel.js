// models/country.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Country = sequelize.define('Country', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    country_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    iso: {
        type: DataTypes.STRING(4),
        allowNull: true,
    },
}, {
    tableName: 'country',
    timestamps: false,
    underscored: true,
});

module.exports = Country;