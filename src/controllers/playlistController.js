// controllers/playlistController.js

const { Playlist, User, Song, PlaylistSong, Album, Artist } = require('../models');
const { Op } = require('sequelize');

// =========================================================================
// GET /api/v2/playlists (Listar todas las Playlists ACTIVAS)
// =========================================================================
const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.findAll({
            where: {
                /* Solo listar playlists que NO están eliminadas */
                is_deleted: false 
            },
            include: [
                { model: User, as: 'Creator', attributes: ['id', 'email'] }
            ]
        });

        res.status(200).json(playlists);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching playlists.', error: error.message });
    }
};

// =========================================================================
// GET /api/v2/playlists/:id (Obtener Playlist por ID con Canciones)
// =========================================================================
const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;

         const playlist = await Playlist.findByPk(id, {
            include: [
                { 
                    model: User, 
                    as: 'Creator', 
                    attributes: ['id', 'email'] 
                },
                { 
                    model: Song, 
                    as: 'Songs',
                    attributes: ['id', 'title', 'duration'],
                    through: { 
                        attributes: ['order_in_playlist', 'added_at']
                    },
                    // INCLUIR info del artista y álbum
                    include: [{
                         model: Album,
                         as: 'Album',
                         attributes: ['id', 'title'],
                         include: [
                                { model: Artist,
                                    as: 'Artist',
                                    attributes: ['id', 'name']}
                            ]}
                        ],
                    // ORDENR por order_in_playlist
                    order: [[{ model: Song, as: 'Songs' }, PlaylistSong, 'order_in_playlist', 'ASC']]
                }
            ]
        });

        if (!playlist || playlist.is_deleted) { // Verificar si existe y si está eliminada
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        res.status(200).json(playlist);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching playlist.', error: error.message });
    }
};


// =========================================================================
// POST /api/v2/playlists (Crear Playlist)
// =========================================================================
const createPlaylist = async (req, res) => {
    try {
        const { name, user_id } = req.body; 

        if (!name || !user_id) {
            return res.status(400).json({ message: 'Name and User ID are required.' });
        }
        
        const newPlaylist = await Playlist.create(req.body);

        res.status(201).json(newPlaylist);

    } catch (error) {
        res.status(500).json({ message: 'Error while creating the playlist.', error: error.message });
    }
};

// =========================================================================
// PUT /api/v2/playlists/:id (Actualizar Nombre o Borrado Lógico)
// =========================================================================
const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, is_deleted } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (typeof is_deleted === 'boolean') {
            updateData.is_deleted = is_deleted;
            
            // Lógica de sft delete
            if (is_deleted === true) {
                updateData.deleted_at = new Date();
            } else if (is_deleted === false) {
                // Si la reactivamos, la fecha debe ser NULL
                updateData.deleted_at = null;
            }
        }

        const [updatedRows] = await Playlist.update(updateData, {
            where: { id },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Playlist not found or no changes were made.' });
        }
        
        const updatedPlaylist = await Playlist.findByPk(id);
        res.status(200).json({ message: 'Playlist successfully updated.', playlist: updatedPlaylist });

    } catch (error) {
        res.status(500).json({ message: 'Error while updating the playlist.', error: error.message });
    }
};

// =========================================================================
// POST /api/v2/playlists/:id/songs (Agregar Canción a Playlist)
// =========================================================================
const addSongToPlaylist = async (req, res) => {
    try {
        const { id } = req.params; 
        const { song_id, order_in_playlist } = req.body; 

        if (!song_id) {
            return res.status(400).json({ message: 'Song ID is required.' });
        }

        const playlist = await Playlist.findByPk(id);
        const song = await Song.findByPk(song_id);

        if (!playlist || !song) {
            return res.status(404).json({ message: 'Playlist or Song not found.' });
        }
        
        // Verificación de borrado
        if (playlist.is_deleted) {
             return res.status(400).json({ message: 'Cannot add songs to a deleted playlist.' });
        }

        await playlist.addSong(song, { through: { order_in_playlist: order_in_playlist || 0 } });

        res.status(200).json({ message: `Song ${song_id} successfully added to playlist ${id}.` });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ message: 'This song is already in the playlist.' });
        }
        res.status(500).json({ message: 'Error while adding song to playlist.', error: error.message });
    }
};

// =========================================================================
// DELETE /api/v2/playlists/:id/songs/:idSong (Quitar Canción de Playlist)
// =========================================================================
const removeSongFromPlaylist = async (req, res) => {
    try {
        const { id, idSong } = req.params; 

        const playlist = await Playlist.findByPk(id);
        const song = await Song.findByPk(idSong);

        if (!playlist || !song) {
            return res.status(404).json({ message: 'Playlist or Song not found.' });
        }

        const removed = await playlist.removeSong(song);
        
        if (removed === 0) {
             return res.status(404).json({ message: 'The song was not found in this playlist.' });
        }

        res.status(200).json({ message: `Song ${idSong} successfully removed from playlist ${id}.` });

    } catch (error) {
        res.status(500).json({ message: 'Error while removing song from playlist.', error: error.message });
    }
};

module.exports = {
    getAllPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
};