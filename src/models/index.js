// models/index.js

const {sequelize} = require('../config/database');
const User = require('./userModel');
const Country = require('./countryModel');
const Artist = require('./artistModel');
const Album = require('./albumModel');
const Song = require('./songModel');
const RecordLabel = require('./recordLabelModel');
const Playlist = require('./playlistModel');
const PlaylistSong = require('./playlistSongModel'); // Tabla N:M
const Genre = require('./genreModel');
const SongGenre = require('./songGenreModel'); // Tabla N:M
const ListeningHistory = require('./listeningHistoryModel');
const PaymentMethod = require('./paymentMethodModel');
const Subscription = require('./subscriptionModel');
const Billing = require('./billingModel');

// ------------------------------------------------------------------
// A) RELACIONES DE GEOGRAFÍA Y MÚSICA (1:N)
// ------------------------------------------------------------------

// 1. User <-> Country
User.belongsTo(Country, { foreignKey: 'country_id', as: 'ResidenceCountry' });
Country.hasMany(User, { foreignKey: 'country_id', as: 'Residents' });

// 2. RecordLabel <-> Country
RecordLabel.belongsTo(Country, { foreignKey: 'country_id', as: 'OriginCountry' });
Country.hasMany(RecordLabel, { foreignKey: 'country_id', as: 'RecordLabels' });

// 3. Artist <-> Album (Un artista tiene muchos álbumes)
Artist.hasMany(Album, { foreignKey: 'id_artist', as: 'Albums' });
Album.belongsTo(Artist, { foreignKey: 'id_artist', as: 'Artist' });

// 4. RecordLabel <-> Album (Un sello tiene muchos álbumes)
RecordLabel.hasMany(Album, { foreignKey: 'id_label', as: 'PublishedAlbums' });
Album.belongsTo(RecordLabel, { foreignKey: 'id_label', as: 'Label' });

// 5. Album <-> Song (Un álbum tiene muchas canciones)
Album.hasMany(Song, { foreignKey: 'id_album', as: 'Songs' });
Song.belongsTo(Album, { foreignKey: 'id_album', as: 'Album' });


// ------------------------------------------------------------------
// B) RELACIONES DE FACTURACIÓN (1:N)
// ------------------------------------------------------------------

// 6. User <-> PaymentMethod (Un usuario tiene muchos métodos de pago)
User.hasMany(PaymentMethod, { foreignKey: 'user_id', as: 'PaymentMethods' });
PaymentMethod.belongsTo(User, { foreignKey: 'user_id', as: 'Owner' });

// 7. User <-> Subscription (Un usuario tiene una suscripción)
User.hasOne(Subscription, { foreignKey: 'user_id', as: 'Subscription' });
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// 8. User <-> Billing (Un usuario tiene muchas facturas)
User.hasMany(Billing, { foreignKey: 'user_id', as: 'Invoices' });
Billing.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// 9. PaymentMethod <-> Billing (Un método se usa en muchas facturas)
PaymentMethod.hasMany(Billing, { foreignKey: 'payment_method_id', as: 'Transactions' });
Billing.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id', as: 'PaymentUsed' });

// 10. Subscription <-> Billing (Una suscripción genera muchas facturas)
Subscription.hasMany(Billing, { foreignKey: 'subscription_id', as: 'BillingRecords' });
Billing.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'Subscription' });


// ------------------------------------------------------------------
// C) RELACIONES DE INTERACCIÓN (1:N)
// ------------------------------------------------------------------

// 11. User <-> Playlist (Un usuario tiene muchas playlists)
User.hasMany(Playlist, { foreignKey: 'user_id', as: 'Playlists' });
Playlist.belongsTo(User, { foreignKey: 'user_id', as: 'Creator' });

// 12. User <-> ListeningHistory (Un usuario tiene un historial de escucha)
User.hasMany(ListeningHistory, { foreignKey: 'user_id', as: 'History' });
ListeningHistory.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// 13. Song <-> ListeningHistory (Una canción está en muchas entradas del historial)
Song.hasMany(ListeningHistory, { foreignKey: 'song_id', as: 'ListenEntries' });
ListeningHistory.belongsTo(Song, { foreignKey: 'song_id', as: 'Song' });


// ------------------------------------------------------------------
// D) RELACIONES MUCHOS A MUCHOS (N:M)
// ------------------------------------------------------------------

// 14. Playlist <-> Song a través de PlaylistSong
Playlist.belongsToMany(Song, {
    through: PlaylistSong,
    foreignKey: 'playlist_id', // FK en la tabla intermedia que apunta a Playlist
    otherKey: 'song_id',      // FK en la tabla intermedia que apunta a Song
    as: 'Tracks'
});
Song.belongsToMany(Playlist, {
    through: PlaylistSong,
    foreignKey: 'song_id',
    otherKey: 'playlist_id',
    as: 'InPlaylists'
});

// 15. Song <-> Genre a través de SongGenre
Song.belongsToMany(Genre, {
    through: SongGenre,
    foreignKey: 'song_id',
    otherKey: 'genre_id',
    as: 'Genres'
});
Genre.belongsToMany(Song, {
    through: SongGenre,
    foreignKey: 'genre_id',
    otherKey: 'song_id',
    as: 'Songs'
});

// ------------------------------------------------------------------

module.exports = {
    sequelize,
    User,
    Country,
    Artist,
    Album,
    Song,
    RecordLabel,
    Playlist,
    PlaylistSong,
    Genre,
    SongGenre,
    ListeningHistory,
    PaymentMethod,
    Subscription,
    Billing,
};