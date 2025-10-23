const { Song, Album, Artist, Genre } = require('../models');
const { Op } = require('sequelize');


// ============================================================================
// POST /api/v2/songs (crear canciówn)
// ============================================================================
const createSong = async (req, res) => {
    try { 
        const { title, duration, id_album} = req.body;
        // 1. Validación de campo obligatorio
        if (!title || !duration) {
            return res.status(400).json({ message: 'Song title and duration are required.' });
        }

        // 2. Validación de duración
        if (typeof duration !== 'number' || duration <= 20) {
            return res.status(400).json({ message: 'Song duration (in seconds) must be a valid number.' });
        }
        
        // 3. Album existe
        const albumExists = await Album.findByPk(id_album);
        if (!albumExists) {
            return res.status(400).json({ message: 'The specified album does not exist.' });
        }

        // 4. Crearrrr
        const newSong = await Song.create(req.body);
        res.status(201).json(newSong);

    } catch (error) {
        res.status(500).json({ message: 'Error while reating song.', error: error.message });
    }
}

// ============================================================================
// GET /api/v2/songs (listar con filtros)
// ============================================================================

const getAllSongs = async (req, res) => {
try {
        const { genre, albumId, artistId } = req.query;
        let whereClause = {};
        let includeClause = [
            { model: Album, as: 'Album',
            attributes: ['id', 'title', 'year'],
            include: [{ model: Artist, as: 'Artist', attributes : ['id','name'] }]
             },
             { model: Genre, as: 'Genres', attributes: ['id', 'name'] }
        ];

        // Filtro por albumId ( si existe lo añado al WHERe princiapl)
        if (albumId) {
            whereClause.id_album = albumId
        }

        // Filtro por género
        if (genre) {
            includeClause[1] = {
                model: Genre,
                as: 'Genres',
                attributes: ['id', 'name'],
                through:{ attributes: [] },
                where: { name: {[Op.like]: `%${genre}%`} },
                required: true
            };
        }

        const songs = await Song.findAll({
            where: whereClause,
            include: includeClause,
            order: [['title', 'ASC']]
        })
        
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Error while getting songs.', error: error.message });
    }
}

// ============================================================================
// POST /api/v2/songs/:songId/genres (Asociar género)
// ============================================================================

const associateGenre = async (req, res) => {
    try {
        const { songId } = req.params;
        const { genreId } = req.body;

        // Existen?
        const song = await Song.findByPk(songId);
        const genre = await Genre.findByPk(genreId);

        if (!song || !genre) {
            return res.status(404).json({ message: 'Song or genre not found.' });
        }

        await song.addGenre(genre);
        res.status(200).json({ message: `Genre ${genreId} successfully associated with song ${songId}.` });
    } catch (error) {
        // Manejo si ya existe el par
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Genre already associated with song.' });
        }
        res.status(500).json({ message: 'Error while associating genre.', error: error.message });
    }
}

// ============================================================================
// DELETE /api/v2/songs/:songId/genres (Desasociar género)
// ============================================================================

const disassociateGenre = async (req, res) => {
    try {
        const { songId, genreId } = req.params;

        // Existen chavales?
        const song = await Song.findByPk(songId);
        const genre = await Genre.findByPk(genreId);

        if (!song || !genre) {
            return res.status(404).json({ message: 'Song or genre not found.' });
        }

        const removed = await song.removeGenre(genre);
        if (removed === 0) {
            return res.status(404).json({ message: 'Genre not associated with song.' });
        }
        res.status(200).json({ message: `Genre ${genreId} successfully disassociated with song ${songId}.` });

    } catch (error) {
        res.status(500).json({ message: 'Error while disassociating genre.', error: error.message });
    }
}

module.exports = {
    createSong,
    getAllSongs,
    associateGenre,
    disassociateGenre
}