// controllers/seederController.js

// 1. Importación de Modelos y Datos
const { sequelize, Country, RecordLabel, Artist, Album, Song, Genre, SongGenre } = require('../models');
const rawData = require('../data/Datos_Spotify.json'); 

// ----------------------------------------------------
// I. FUNCIONES DE AYUDA (PRE-PROCESAMIENTO)
// ----------------------------------------------------

/**
 * Extrae países únicos de la lista de discográficas en el JSON.
 * @param {object} data - Contenido del JSON.
 * @returns {Array<object>} Lista de objetos { country_name: 'Nombre' }.
 */
const getUniqueCountries = (data) => {
    // Usamos un Set para asegurar que cada país aparezca solo una vez.
    const countries = new Set(data.discografica.map(rl => rl.pais).filter(p => p));
    
    return Array.from(countries).map(name => ({ country_name: name }));
};

/**
 * Extrae géneros únicos de la lista de canciones, manejando el formato 'gen1; gen2'.
 * @param {object} data - Contenido del JSON.
 * @returns {Array<object>} Lista de objetos { genre_name: 'Nombre' }.
 */
const getUniqueGenres = (data) => {
    const genreSet = new Set();
    data.cancion.forEach(s => {
        if (s.generos) {
            // Dividimos la cadena de géneros por el separador ';'
            s.generos.split(';').map(g => g.trim()).filter(g => g).forEach(g => genreSet.add(g));
        }
    });
    return Array.from(genreSet).map(name => ({ name: name }));
};

// ----------------------------------------------------
// II. FUNCIÓN PRINCIPAL DE SEEDING
// ----------------------------------------------------

exports.seedDatabase = async (req, res) => {
    let transaction;
    
    try {
        // PASO 1: Iniciar Transacción
        // Esto garantiza que todas las inserciones se hagan como una sola operación atómica.
        // Si cualquier paso falla, se hará un 'rollback' y la BD quedará limpia.
        transaction = await sequelize.transaction();

        console.log("Iniciando la carga de datos...");
        
        // --- NIVEL 1: ENTIDADES SIN DEPENDENCIAS (Tablas sin FKs externas) ---

        // 1.1 Carga de Paises (Countries)
        const countryData = getUniqueCountries(rawData);
        const countries = await Country.bulkCreate(countryData, { transaction, ignoreDuplicates: true });
        const countryMap = new Map(countries.map(c => [c.country_name, c.id]));
        // -> countryMap: Usado para buscar rápidamente el ID de un país por su nombre ('Argentina' -> 5)

        // 1.2 Carga de Géneros (Genres)
        const genreData = getUniqueGenres(rawData);
        const genres = await Genre.bulkCreate(genreData, { transaction, ignoreDuplicates: true });
        const genreMap = new Map(genres.map(g => [g.name, g.id]));
        // -> genreMap: Usado para buscar el ID de un género por su nombre ('Rock Prog' -> 12)

        // 1.3 Carga de Artistas (Artists)
        const artistData = rawData.artista.map(a => {
            // Corrección de dato sucio: El JSON tiene un error de formateo en 'Guns\\\'n Roses'
            const cleanedName = a.artista.replace(/','Guns\\'n Roses.jpg$/, '').trim(); 
            return {
                name: cleanedName, // Mapea a la columna 'name'
                image: a.imagen     // Mapea a la columna 'image'
            };
        });
        const artists = await Artist.bulkCreate(artistData, { transaction, ignoreDuplicates: true });
        const artistMap = new Map(artists.map(a => [a.name, a.id]));
        // -> artistMap: Usado para buscar el ID de un artista por su nombre ('Pink Floyd' -> 1)

        console.log("Nivel 1 (Entidades independientes) cargado.");

        // --- NIVEL 2: ENTIDADES CON DEPENDENCIAS SIMPLES (Requieren 1 o 2 FKs) ---

        // 2.1 Carga de Discográficas (RecordLabels) - Depende de Country
        const labelData = rawData.discografica.map(rl => ({
            name: rl.discografica,
            // Usamos el Map del paso 1.1 para obtener el ID de la FK
            country_id: countryMap.get(rl.pais) 
        }));
        const recordLabels = await RecordLabel.bulkCreate(labelData, { transaction, ignoreDuplicates: true });
        const recordLabelMap = new Map(recordLabels.map(rl => [rl.name, rl.id]));
        // -> recordLabelMap: Usado para buscar el ID del sello

        // 2.2 Carga de Álbumes (Albums) - Depende de Artist y RecordLabel
        const albumData = rawData.album
            .map(a => {
                const cleanedArtistName = a.artista ? a.artista.replace(/','Guns\\'n Roses.jpg$/, '').trim() : null;
                return {
                    title: a.album,
                    year: a.year, // Ya corregimos el tipo a INT en el modelo
                    image: a.imagenportada,
                    // Buscamos los IDs requeridos:
                    id_artist: artistMap.get(cleanedArtistName), 
                    id_label: recordLabelMap.get(a.discografica) 
                };
            })
            // Filtramos cualquier álbum que no tenga un artista o sello válido (FKs nulas)
            .filter(a => a.id_artist && a.id_label); 
            
        const albums = await Album.bulkCreate(albumData, { transaction, ignoreDuplicates: true });
        // Mapeamos por una clave compuesta (NombreAlbum-IDArtista) para asegurar unicidad
        const albumMap = new Map(albums.map(a => [`${a.title}-${a.id_artist}`, a.id]));

        console.log("Nivel 2 (Entidades con FKs) cargado.");

        // --- NIVEL 3: ENTIDADES COMPLEJAS Y RELACIONES N:M ---

        const songGenreEntries = [];

        // 3.1 Carga de Canciones (Songs) - Depende de Album ID
        const songData = rawData.cancion
            .map(s => {
                const cleanedArtistName = s.artista ? s.artista.replace(/','Guns\\'n Roses.jpg$/, '').trim() : null;
                const albumKey = `${s.album}-${artistMap.get(cleanedArtistName)}`;
                const albumId = albumMap.get(albumKey);

                if (!albumId) return null; // Si no encontramos el álbum, saltamos la canción (Integridad)

                const songEntry = {
                    title: s.cancion,
                    duration: s.duracion_min,
                    views: s.reproducciones,
                    likes: s.likes,
                    id_album: albumId // Asignamos el ID del álbum encontrado
                };

                // Lógica de la relación N:M (Song x Genre)
                if (s.generos) {
                    s.generos.split(';').map(g => g.trim()).filter(g => g).forEach(genreName => {
                        const genreId = genreMap.get(genreName);
                        if (genreId) {
                            // Almacenamos la información de la relación temporalmente
                            songGenreEntries.push({ song_title: s.cancion, album_id: albumId, genre_id: genreId });
                        }
                    });
                }
                return songEntry;
            }).filter(s => s !== null);

        const songs = await Song.bulkCreate(songData, { transaction, ignoreDuplicates: true });
        // Mapeo por clave compuesta de la canción (Título-IDÁlbum)
        const songMap = new Map(songs.map(s => [`${s.title}-${s.id_album}`, s.id]));

        // 3.2 Carga de Relación SongGenre (N:M)
        const finalSongGenreData = songGenreEntries
            .map(entry => {
                const songKey = `${entry.song_title}-${entry.album_id}`;
                const songId = songMap.get(songKey); // Buscamos el ID real de la canción recién insertada
                if (songId) {
                    return {
                        song_id: songId, // PK compuesta 1
                        genre_id: entry.genre_id // PK compuesta 2
                    };
                }
                return null;
            })
            .filter(sg => sg !== null);

        await SongGenre.bulkCreate(finalSongGenreData, { transaction, ignoreDuplicates: true });

        console.log("Nivel 3 (Canciones y N:M) cargado exitosamente.");

        // PASO 2: Commit de la Transacción
        await transaction.commit();
        
        return res.status(200).json({ message: "Base de datos poblada exitosamente con datos de Spotify." });

    } catch (error) {
        // PASO 3: Rollback
        // Si hay un error en cualquier punto, se deshace la transacción
        if (transaction) await transaction.rollback();
        console.error("Error al poblar la base de datos:", error);
        return res.status(500).json({ error: "Fallo en la carga de datos. Se deshicieron todos los cambios.", details: error.message });
    }
};