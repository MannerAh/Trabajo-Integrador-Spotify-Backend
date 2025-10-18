// models/song.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Song = sequelize.define('Song', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    // id_album será manejado por la asociación
}, {
    tableName: 'song',
    timestamps: false,
    underscored: true,
});

module.exports = Song;