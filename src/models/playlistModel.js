// models/playlist.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Playlist = sequelize.define('Playlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    // user_id será manejado por la asociación
}, {
    tableName: 'playlist',
    timestamps: true, // Deja create_time y update_time como timestamps
    createdAt: 'create_time',
    updatedAt: false,
    underscored: true,
});

module.exports = Playlist;