// models/song_genre.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const SongGenre = sequelize.define('SongGenre', {
    song_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
}, {
    tableName: 'song_genre',
    timestamps: false,
    underscored: true,
    // Deshabilita la generación automática de la clave foránea aquí, se maneja en las asociaciones
    freezeTableName: true, 
});

module.exports = SongGenre;