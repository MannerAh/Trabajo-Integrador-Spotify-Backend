// models/listeningHistoryModel
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ListeningHistory = sequelize.define('ListeningHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    played_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // user_id y song_id serán manejados por las asociaciones
}, {
    tableName: 'listening_history',
    timestamps: false,
    underscored: true,
});

module.exports = ListeningHistory;