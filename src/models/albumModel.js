// models/album.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Album = sequelize.define('Album', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    year: {
        type: DataTypes.INTEGER, // Solo el año
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    // id_label y id_artist serán manejados por las asociaciones!!!
}, {
    tableName: 'album',
    timestamps: false,
    underscored: true,
});

module.exports = Album;