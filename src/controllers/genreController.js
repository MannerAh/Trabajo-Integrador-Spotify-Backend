// controllers/genreController.js

const { Genre } = require('../models');

// =========================================================================
// GET /api/v2/generos (Listar todos los Géneros)
// =========================================================================
const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll({
            attributes: ['id', 'name']
        });

        res.status(200).json(genres);

    } catch (error) {
        res.status(500).json({ message: 'Error while fetching genres.', error: error.message });
    }
};

// =========================================================================
// POST /api/v2/generos (Crear Género)
// =========================================================================
const createGenre = async (req, res) => {
    try {
        const { name } = req.body; 

        if (!name) {
            return res.status(400).json({ message: 'The genre name is required.' });
        }

        const existingGenre = await Genre.findOne({
            where: {
                name: name
            }
        });
        if (existingGenre) {
            return res.status(400).json({ message: `The genre '${name}' already exists.` });
        }

        const newGenre = await Genre.create({ name });

        res.status(201).json(newGenre);

    } catch (error) {
        res.status(500).json({ message: 'Error while creating the genre.', error: error.message });
    }
};

module.exports = {
    getAllGenres,
    createGenre
};