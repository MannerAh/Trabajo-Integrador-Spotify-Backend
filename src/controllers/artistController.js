// controllers/artistController.js

const { Artist, Album } = require('../models'); 

// GET /api/v1/artists
const getAllArtists = async (req, res) => {
    try {
        const artists = await Artist.findAll({
            include: [{ 
                model: Album, 
                as: 'Albums',
                attributes: ['id', 'title', 'year'] 
            }]
        });
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: 'Error while getting artist.', error: error.message });
    }
};

// GET /api/v1/artists/:id
const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findByPk(req.params.id, {
            include: [{ model: Album, as: 'Albums' }] 
        });

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found.' });
        }
        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ message: 'Error while getting artist.', error: error.message });
    }
};

// POST /api/v1/artists
const createArtist = async (req, res) => {
    try {
        const { name, image } = req.body;
        // 1. Validación de campo obligatoriouu
        if (!name) {
            return res.status(400).json({ message: 'Artist name is required.' });
        }
        const existingArtist = await Artist.findOne({ where: { name } });
        // 2. Validar que el artista no existe
        if (existingArtist) {
            return res.status(400).json({ message: 'Artist already exists.' });
        }
        // 3. Crear artista
        const artist = await Artist.create(req.body);
        res.status(201).json(artist);
    } catch (error) {
        res.status(500).json({ message: 'Error while creating artist.', error: error.message });
    }
}

module.exports = {
    getAllArtists,
    getArtistById,
    createArtist
};