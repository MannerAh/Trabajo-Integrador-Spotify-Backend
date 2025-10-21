// routes/artistRoutes.js

const express = require('express');
const router = express.Router();
const { getAllArtists,
    getArtistById,
    createArtist
} = require('../controllers/artistController');

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.post('/', createArtist)

module.exports = router;