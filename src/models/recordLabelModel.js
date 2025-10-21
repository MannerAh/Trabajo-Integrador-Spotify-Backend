// models/country.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Label = sequelize.define('Label', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'record_label',
    timestamps: false,
    underscored: true,
});

module.exports = Label;