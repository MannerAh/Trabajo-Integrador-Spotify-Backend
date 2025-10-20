// models/playlist_song.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlaylistSong = sequelize.define('PlaylistSong', {
    song_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    playlist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    order_in_playlist: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    added_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'playlist_song',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
});

module.exports = PlaylistSong;