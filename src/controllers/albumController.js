// controllers/albumController.js

const { Album, Artist, Song } = require('../models');
const { Op } = require('sequelize'); // Necesario para la búsqueda con 'like'

// =========================================================================
// GET /api/v2/albums?artistId=X&q=Y (Listar y Filtrar Álbumes)
// =========================================================================
const getAllAlbums = async (req, res) => {
    try {
        const { artistaId, q } = req.query;
        let whereCondition = {};
        
        // 1. Filtrar por ID de Artista
        if (artistaId) {
            whereCondition.id_artist = artistaId;
        }

        // 2. Filtrar/Buscar por título (q)
        if (q) {
            whereCondition.title = { [Op.like]: `%${q}%` };
        }

        const albums = await Album.findAll({
            where: whereCondition,
            // Incluir el Artista para que la respuesta sea más útil
            include: [
                { model: Artist, as: 'Artist', attributes: ['id', 'name'] }
            ]
        });

        res.status(200).json(albums);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching albums.', error: error.message });
    }
};


// =========================================================================
// POST /api/v2/albumes (Create Album)
// =========================================================================
const createAlbum = async (req, res) => {
    try {
        const { title, year, image, id_artist } = req.body; 

        if (!title || !id_artist) {
            return res.status(400).json({ message: 'Title and Artist ID are required.' });
        }

        // 1. Validar unicidad (mismo título para el mismo artista)
        const existingAlbum = await Album.findOne({
            where: {
                title: title,
                id_artist: id_artist
            }
        });
        if (existingAlbum) {
            return res.status(400).json({ message: 'An album with this title already exists for this artist.' });
        }

        // 2. Verificación de existencia de Artista (FK)
        const artistExists = await Artist.findByPk(id_artist);
        if (!artistExists) {
            return res.status(400).json({ message: 'The specified Artist does not exist.' });
        }

        // 3. Creación del Álbum
        const newAlbum = await Album.create(req.body);

        res.status(201).json(newAlbum);

    } catch (error) {
        res.status(500).json({ message: 'Error while creating the album.', error: error.message });
    }
};


// =========================================================================
// GET /api/v2/albums/:id (Get Album by ID with Artist and Songs)
// =========================================================================
const getAlbumById = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await Album.findByPk(id, {
            // Incluir todas las asociaciones
            include: [
                { model: Artist, as: 'Artist', attributes: ['id', 'name'] },
                { model: Song, as: 'Songs', attributes: ['id', 'title', 'duration'] }
            ]
        });

        if (!album) {
            return res.status(404).json({ message: 'Album not found.' });
        }

        res.status(200).json(album);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching album.', error: error.message });
    }
};


// =========================================================================
// GET /api/v2/albumes/:id/canciones (Get only the Songs of an Album)
// =========================================================================
const getAlbumSongs = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await Album.findByPk(id, {
            attributes: ['id', 'title'], // Solo necesitamos el ID y Título del álbum
            include: [
                { model: Song, as: 'Songs', attributes: ['id', 'title', 'duration'] }
            ]
        });

        if (!album) {
            return res.status(404).json({ message: 'Album not found.' });
        }

        // Devolver solo el array de canciones
        res.status(200).json(album.Songs);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching album songs.', error: error.message });
    }
};


// =========================================================================
// PUT /api/v2/albumes/:id (Update Album)
// =========================================================================
const updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await Album.update(req.body, {
            where: { id },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Album not found or no changes were made.' });
        }
        
        const updatedAlbum = await Album.findByPk(id);
        res.status(200).json({ message: 'Album successfully updated.', album: updatedAlbum });

    } catch (error) {
        res.status(500).json({ message: 'Error while updating the album.', error: error.message });
    }
};

// =========================================================================
// DELETE /api/v2/albumes/:id (Delete Album)
// =========================================================================
const deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRows = await Album.destroy({
            where: { id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Album not found.' });
        }

        res.status(200).json({ message: 'Album successfully deleted.' });

    } catch (error) {
        res.status(500).json({ message: 'Error while deleting the album.', error: error.message });
    }
};


module.exports = {
    getAllAlbums,
    createAlbum,
    getAlbumById,
    getAlbumSongs,
    updateAlbum,
    deleteAlbum,
};