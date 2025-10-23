# 🎵 Spotify Backend - Documentación de API

## 📋 Índice
- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Usuarios](#usuarios)
- [Artistas](#artistas)
- [Álbumes](#álbumes)
- [Canciones](#canciones)
- [Géneros](#géneros)
- [Playlists](#playlists)
- [Suscripciones](#suscripciones)
- [Métodos de Pago](#métodos-de-pago)
- [Pagos](#pagos)
- [Vistas Avanzadas](#vistas-avanzadas)
- [Códigos de Error](#códigos-de-error)

---

## 🌐 Información General

**Base URL**: `http://localhost:3000/api/v2`

**Formato de Respuesta**: JSON

**Autenticación**: JWT (Bearer Token) en endpoints protegidos

---

## 🔐 Autenticación

### Registro de Usuario
Crea un nuevo usuario en el sistema.

**Endpoint**: `POST /users/register`

**Acceso**: Público

**Body**:
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "birth_date": "1995-05-20",
  "gender": "male",
  "zipcode": "2800",
  "country_id": 1
}
```

**Respuesta Exitosa** (201):
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

**Errores**:
- `400`: Email y password son requeridos
- `400`: Email ya está en uso

---

### Login de Usuario
Autentica a un usuario existente y devuelve un token JWT.

**Endpoint**: `POST /users/login`

**Acceso**: Público

**Body**:
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Login successful.",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "username": "user123",
    "role": "FREE"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores**:
- `401`: Credenciales inválidas

---

## 👥 Usuarios

### Listar Todos los Usuarios
Obtiene una lista de todos los usuarios registrados.

**Endpoint**: `GET /users`

**Acceso**: 🔒 Protegido (requiere token)

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters** (opcional):
- `page`: Número de página (default: 1)
- `limit`: Cantidad de resultados (default: 20)

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "email": "usuario@example.com",
    "username": "user123",
    "create_time": "2024-10-01T10:00:00.000Z",
    "gender": "male",
    "birth_date": "1995-05-20",
    "role": "FREE",
    "country_id": 1
  }
]
```

---

### Obtener Usuario por ID
Obtiene los detalles de un usuario específico.

**Endpoint**: `GET /users/:id`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "username": "user123",
  "create_time": "2024-10-01T10:00:00.000Z",
  "gender": "male",
  "birth_date": "1995-05-20",
  "role": "FREE",
  "country_id": 1
}
```

**Errores**:
- `404`: Usuario no encontrado

---

### Listar Usuarios con Contraseña Vencida
Obtiene usuarios cuya contraseña no se ha actualizado en más de 90 días.

**Endpoint**: `GET /users/expired-password`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Found 2 users with passwords older than 90 days.",
  "users": [
    {
      "id": 1,
      "email": "usuario@example.com",
      "username": "user123",
      "pass_updated_at": "2024-05-01T10:00:00.000Z",
      "role": "FREE"
    }
  ]
}
```

---

## 🎤 Artistas

### Crear Artista
Crea un nuevo artista en el sistema.

**Endpoint**: `POST /artists`

**Acceso**: Público

**Body**:
```json
{
  "name": "Pink Floyd",
  "image": "https://example.com/pink-floyd.jpg"
}
```

**Respuesta Exitosa** (201):
```json
{
  "message": "Artist created successfully.",
  "artist": {
    "id": 1,
    "name": "Pink Floyd",
    "image": "https://example.com/pink-floyd.jpg"
  }
}
```

**Errores**:
- `400`: Nombre es requerido
- `409`: El nombre del artista ya existe

---

### Listar Todos los Artistas
Obtiene una lista de todos los artistas.

**Endpoint**: `GET /artists`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "name": "Pink Floyd",
    "image": "https://example.com/pink-floyd.jpg"
  },
  {
    "id": 2,
    "name": "The Beatles",
    "image": "https://example.com/beatles.jpg"
  }
]
```

---

### Obtener Artista por ID
Obtiene los detalles de un artista específico.

**Endpoint**: `GET /artists/:id`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "name": "Pink Floyd",
  "image": "https://example.com/pink-floyd.jpg",
  "Albums": [
    {
      "id": 1,
      "title": "The Wall",
      "release_year": 1979
    }
  ]
}
```

**Errores**:
- `404`: Artista no encontrado

---

## 💿 Álbumes

### Crear Álbum
Crea un nuevo álbum asociado a un artista.

**Endpoint**: `POST /albums`

**Acceso**: Público

**Body**:
```json
{
  "title": "The Wall",
  "release_year": 1979,
  "image": "https://example.com/the-wall.jpg",
  "artist_id": 1,
  "label_id": 1
}
```

**Respuesta Exitosa** (201):
```json
{
  "message": "Album created successfully.",
  "album": {
    "id": 1,
    "title": "The Wall",
    "release_year": 1979,
    "image": "https://example.com/the-wall.jpg",
    "artist_id": 1,
    "label_id": 1
  }
}
```

**Errores**:
- `400`: Título y artista son requeridos
- `404`: Artista no encontrado
- `409`: El álbum ya existe para este artista

---

### Listar Todos los Álbumes
Obtiene una lista de todos los álbumes.

**Endpoint**: `GET /albums`

**Acceso**: Público

**Query Parameters** (opcional):
- `q`: Búsqueda por título (parcial)
- `artistId`: Filtrar por ID de artista

**Ejemplos**:
```
GET /albums?q=wall
GET /albums?artistId=1
GET /albums?q=dark&artistId=1
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "title": "The Wall",
    "release_year": 1979,
    "image": "https://example.com/the-wall.jpg",
    "Artist": {
      "id": 1,
      "name": "Pink Floyd"
    },
    "RecordLabel": {
      "id": 1,
      "name": "Sony Music"
    }
  }
]
```

---

### Obtener Álbum por ID
Obtiene los detalles completos de un álbum, incluyendo sus canciones.

**Endpoint**: `GET /albums/:id`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "title": "The Wall",
  "release_year": 1979,
  "image": "https://example.com/the-wall.jpg",
  "Artist": {
    "id": 1,
    "name": "Pink Floyd"
  },
  "Songs": [
    {
      "id": 1,
      "title": "Another Brick in the Wall",
      "duration": 238
    }
  ]
}
```

**Errores**:
- `404`: Álbum no encontrado

---

### Obtener Canciones de un Álbum
Obtiene solo las canciones de un álbum específico.

**Endpoint**: `GET /albums/:id/songs`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "title": "Another Brick in the Wall",
    "duration": 238,
    "views": 1000000,
    "likes": 50000
  },
  {
    "id": 2,
    "title": "Comfortably Numb",
    "duration": 382,
    "views": 2000000,
    "likes": 80000
  }
]
```

**Errores**:
- `404`: Álbum no encontrado

---

### Actualizar Álbum
Actualiza la información de un álbum existente.

**Endpoint**: `PUT /albums/:id`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body** (todos los campos son opcionales):
```json
{
  "title": "The Wall - Deluxe Edition",
  "release_year": 2024,
  "image": "https://example.com/wall-deluxe.jpg"
}
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Album updated successfully.",
  "album": {
    "id": 1,
    "title": "The Wall - Deluxe Edition",
    "release_year": 2024
  }
}
```

**Errores**:
- `404`: Álbum no encontrado

---

### Eliminar Álbum
Elimina un álbum del sistema.

**Endpoint**: `DELETE /albums/:id`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Album deleted successfully."
}
```

**Errores**:
- `404`: Álbum no encontrado

---

## 🎵 Canciones

### Crear Canción
Crea una nueva canción asociada a un álbum.

**Endpoint**: `POST /songs`

**Acceso**: Público

**Body**:
```json
{
  "title": "Comfortably Numb",
  "duration": 382,
  "album_id": 1
}
```

**Nota**: La duración debe ser en **segundos** (INT), no en formato mm:ss.

**Respuesta Exitosa** (201):
```json
{
  "message": "Song created successfully.",
  "song": {
    "id": 1,
    "title": "Comfortably Numb",
    "duration": 382,
    "album_id": 1,
    "views": 0,
    "likes": 0
  }
}
```

**Errores**:
- `400`: Título, duración y álbum son requeridos
- `400`: La duración debe ser un número entero positivo
- `404`: Álbum no encontrado

---

### Listar Todas las Canciones
Obtiene una lista de todas las canciones.

**Endpoint**: `GET /songs`

**Acceso**: Público

**Query Parameters** (opcional):
- `genres`: Filtrar por género (nombre)
- `albumId`: Filtrar por ID de álbum
- `artistId`: Filtrar por ID de artista

**Ejemplos**:
```
GET /songs?genres=Rock
GET /songs?albumId=1
GET /songs?genres=Jazz&albumId=24
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "title": "Comfortably Numb",
    "duration": 382,
    "views": 1000000,
    "likes": 50000,
    "Album": {
      "id": 1,
      "title": "The Wall",
      "Artist": {
        "id": 1,
        "name": "Pink Floyd"
      }
    },
    "Genres": [
      {
        "id": 1,
        "name": "Rock"
      }
    ]
  }
]
```

---

### Obtener Canción por ID
Obtiene los detalles completos de una canción.

**Endpoint**: `GET /songs/:id`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "title": "Comfortably Numb",
  "duration": 382,
  "views": 1000000,
  "likes": 50000,
  "Album": {
    "id": 1,
    "title": "The Wall",
    "Artist": {
      "id": 1,
      "name": "Pink Floyd"
    }
  },
  "Genres": [
    {
      "id": 1,
      "name": "Rock"
    },
    {
      "id": 2,
      "name": "Progressive Rock"
    }
  ]
}
```

**Errores**:
- `404`: Canción no encontrada

---

### Actualizar Canción
Actualiza la información de una canción existente.

**Endpoint**: `PUT /songs/:id`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body** (todos los campos son opcionales):
```json
{
  "title": "Comfortably Numb (Live)",
  "duration": 450
}
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Song updated successfully.",
  "song": {
    "id": 1,
    "title": "Comfortably Numb (Live)",
    "duration": 450
  }
}
```

**Errores**:
- `404`: Canción no encontrada

---

### Asociar Género a Canción
Agrega un género a una canción (relación muchos a muchos).

**Endpoint**: `POST /songs/:id/genres`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "genreId": 3
}
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Genre successfully added to song."
}
```

**Errores**:
- `400`: Genre ID es requerido
- `404`: Canción o género no encontrado
- `400`: El género ya está asociado a esta canción

---

### Quitar Género de Canción
Elimina la asociación de un género con una canción.

**Endpoint**: `DELETE /songs/:id/genres/:genreId`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Genre successfully removed from song."
}
```

**Errores**:
- `404`: Canción o género no encontrado
- `404`: La canción no tiene ese género asociado

---

## 🎭 Géneros

### Crear Género
Crea un nuevo género musical.

**Endpoint**: `POST /genres`

**Acceso**: Público

**Body**:
```json
{
  "name": "Progressive Rock"
}
```

**Respuesta Exitosa** (201):
```json
{
  "message": "Genre created successfully.",
  "genre": {
    "id": 1,
    "name": "Progressive Rock"
  }
}
```

**Errores**:
- `400`: Nombre es requerido
- `409`: El género ya existe

---

### Listar Todos los Géneros
Obtiene una lista de todos los géneros disponibles.

**Endpoint**: `GET /genres`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "name": "Rock"
  },
  {
    "id": 2,
    "name": "Pop"
  },
  {
    "id": 3,
    "name": "Jazz"
  }
]
```

---

## 📝 Playlists

### Crear Playlist
Crea una nueva playlist para un usuario.

**Endpoint**: `POST /playlists`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "name": "Mi Playlist Favorita",
  "user_id": 1,
}
```

**Respuesta Exitosa** (201):
```json
{
  "message": "Playlist created successfully.",
  "playlist": {
    "id": 1,
    "name": "Mi Playlist Favorita",
    "user_id": 1,
    "is_deleted": false,
    "create_time": "2024-10-23T10:00:00.000Z"
  }
}
```

**Errores**:
- `400`: Nombre y User ID son requeridos
- `404`: Usuario no encontrado

---

### Listar Todas las Playlists
Obtiene una lista de todas las playlists activas.

**Endpoint**: `GET /playlists`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "name": "Mi Playlist Favorita",
    "is_deleted": false,
    "create_time": "2024-10-23T10:00:00.000Z",
    "Creator": {
      "id": 1,
      "email": "usuario@example.com",
      "username": "user123"
    }
  }
]
```

---

### Obtener Playlist por ID
Obtiene los detalles completos de una playlist, incluyendo todas sus canciones ordenadas.

**Endpoint**: `GET /playlists/:id`

**Acceso**: Público

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "name": "Mi Playlist Favorita",
  "is_deleted": false,
  "create_time": "2024-10-23T10:00:00.000Z",
  "Creator": {
    "id": 1,
    "email": "usuario@example.com",
    "username": "user123"
  },
  "Songs": [
    {
      "id": 1,
      "title": "Comfortably Numb",
      "duration": 382,
      "PlaylistSong": {
        "order_in_playlist": 1,
        "added_at": "2024-10-23T11:00:00.000Z"
      },
      "Album": {
        "id": 1,
        "title": "The Wall",
        "Artist": {
          "id": 1,
          "name": "Pink Floyd"
        }
      }
    }
  ]
}
```

**Errores**:
- `404`: Playlist no encontrada

---

### Actualizar Playlist
Actualiza el nombre, descripción o estado de una playlist.

**Endpoint**: `PUT /playlists/:id`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body** (todos los campos son opcionales):
```json
{
  "name": "Nuevo Nombre",
  "is_deleted": false
}
```

**Soft Delete**: Para eliminar una playlist (soft delete):
```json
{
  "is_deleted": true
}
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Playlist successfully updated.",
  "playlist": {
    "id": 1,
    "name": "Nuevo Nombre",
    "is_deleted": true,
    "deleted_at": "2024-10-23T12:00:00.000Z"
  }
}
```

**Errores**:
- `404`: Playlist no encontrada

---

### Agregar Canción a Playlist
Agrega una canción a una playlist existente.

**Endpoint**: `POST /playlists/:id/songs`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "song_id": 5,
  "order_in_playlist": 3
}
```

**Nota**: Si no se proporciona `order_in_playlist`, se calcula automáticamente como el siguiente número.

**Respuesta Exitosa** (200):
```json
{
  "message": "Song 'Comfortably Numb' successfully added to playlist 'Mi Playlist Favorita' at position 3.",
  "order": 3
}
```

**Errores**:
- `400`: Song ID es requerido
- `404`: Playlist o canción no encontrada
- `400`: No se pueden agregar canciones a una playlist eliminada
- `400`: Esta canción ya está en la playlist

---

### Quitar Canción de Playlist
Elimina una canción de una playlist.

**Endpoint**: `DELETE /playlists/:id/songs/:idSong`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
{
  "message": "Song 'Comfortably Numb' successfully removed from playlist 'Mi Playlist Favorita'."
}
```

**Errores**:
- `404`: Playlist o canción no encontrada
- `404`: La canción no está en esta playlist

---


**Errores**:
- `400`: new_order es requerido
- `404`: Canción no encontrada en esta playlist

---

## 💳 Suscripciones

### Crear Suscripción
Crea una nueva suscripción para un usuario.

**Endpoint**: `POST /subscriptions`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "user_id": 1,
  "type": "PREMIUM",
  "start_date": "2024-10-01T00:00:00Z",
  "renewal_date": "2024-11-01T00:00:00Z"
}
```

**Tipos válidos**: `FREE`, `PREMIUM`, `FAMILY`

**Validaciones**:
- `renewal_date` debe ser mayor que `start_date`
- No puede haber dos suscripciones con el mismo `user_id` y `start_date`

**Respuesta Exitosa** (201):
```json
{
  "message": "Subscription created successfully.",
  "subscription": {
    "id": 1,
    "user_id": 1,
    "type": "PREMIUM",
    "start_date": "2024-10-01",
    "renewal_date": "2024-11-01",
    "price": 9.99
  }
}
```

**Errores**:
- `400`: Datos requeridos faltantes
- `400`: La fecha de renovación debe ser posterior a la fecha de inicio
- `409`: Ya existe una suscripción para este usuario en esta fecha

---

### Listar Todas las Suscripciones
Obtiene una lista de todas las suscripciones.

**Endpoint**: `GET /subscriptions`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "type": "PREMIUM",
    "start_date": "2024-10-01",
    "renewal_date": "2024-11-01",
    "price": 9.99,
    "User": {
      "id": 1,
      "email": "usuario@example.com"
    }
  }
]
```

---

### Obtener Suscripción por ID
Obtiene los detalles de una suscripción específica.

**Endpoint**: `GET /subscriptions/:id`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa** (200):
```json
{
  "id": 1,
  "type": "PREMIUM",
  "start_date": "2024-10-01",
  "renewal_date": "2024-11-01",
  "price": 9.99,
  "renewed_times": 3,
  "User": {
    "id": 1,
    "email": "usuario@example.com",
    "username": "user123"
  }
}
```

**Errores**:
- `404`: Suscripción no encontrada

---

## 💰 Métodos de Pago

### Crear Método de Pago
Registra un nuevo método de pago para un usuario.

**Endpoint**: `POST /payment-methods`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "user_id": 1,
  "type": "VISA",
  "last_four_digits": "4321",
  "expiration_date": "2028-12-01",
  "is_primary": true,
  "token": "tok_1234567890abcdef"
}
```

**Tipos válidos**: `VISA`, `MASTERCARD`, `AMEX`, `PAYPAL`

**Seguridad**:
- ⚠️ **NUNCA** se guarda el número completo de tarjeta
- ⚠️ **NUNCA** se guarda el CVC
- Solo se almacenan los últimos 4 dígitos enmascarados

**Respuesta Exitosa** (201):
```json
{
  "message": "Payment method created successfully.",
  "paymentMethod": {
    "id": 1,
    "user_id": 1,
    "type": "VISA",
    "last_four_digits": "4321",
    "expiration_date": "2028-12-01",
    "is_primary": true
  }
}
```

**Errores**:
- `400`: Datos requeridos faltantes
- `404`: Usuario no encontrado

---

### Listar Métodos de Pago por Usuario
Obtiene todos los métodos de pago de un usuario.

**Endpoint**: `GET /payment-methods`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `userId`: ID del usuario (requerido)

**Ejemplo**:
```
GET /payment-methods?userId=1
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "type": "VISA",
    "last_four_digits": "4321",
    "expiration_date": "2028-12-01",
    "is_primary": true
  },
  {
    "id": 2,
    "type": "PAYPAL",
    "last_four_digits": null,
    "expiration_date": null,
    "is_primary": false
  }
]
```

**Errores**:
- `400`: userId es requerido

---

## 💵 Pagos

### Registrar Pago
Registra un nuevo pago asociado a una suscripción.

**Endpoint**: `POST /payments`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "user_id": 1,
  "subscription_id": 1,
  "payment_method_id": 1,
  "amount": 9.99,
  "billing_date": "2024-10-01T00:00:00Z"
}
```

**Respuesta Exitosa** (201):
```json
{
  "message": "Payment registered successfully.",
  "payment": {
    "id": 1,
    "user_id": 1,
    "subscription_id": 1,
    "payment_method_id": 1,
    "amount": 9.99,
    "billing_date": "2024-10-01",
    "status": "completed"
  }
}
```

**Errores**:
- `400`: Datos requeridos faltantes
- `404`: Usuario, suscripción o método de pago no encontrado

---

### Listar Pagos por Usuario y Rango de Fechas
Obtiene el historial de pagos de un usuario en un rango de fechas.

**Endpoint**: `GET /payments`

**Acceso**: 🔒 Protegido

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `userId`: ID del usuario (requerido)
- `desde`: Fecha de inicio (formato: YYYY-MM-DD)
- `hasta`: Fecha de fin (formato: YYYY-MM-DD)

**Ejemplo**:
```
GET /payments?userId=1&desde=2024-09-01&hasta=2024-12-31
```

**Respuesta Exitosa** (200):
```json
[
  {
    "id": 1,
    "amount": 9.99,
    "billing_date": "2024-10-01",
    "status": "completed",
    "Subscription": {
      "id": 1,
      "type": "PREMIUM"
    },
    "PaymentMethod": {
      "id": 1,
      "type": "VISA",
      "last_four_digits": "4321"
    }
  },
  {
    "id": 2,
    "amount": 9.99,
    "billing_date": "2024-11-01",
    "status": "completed",
    "Subscription": {
      "id": 1,
      "type": "PREMIUM"
    },
    "PaymentMethod": {
      "id": 1,
      "type": "VISA",
      "last_four_digits": "4321"
    }
  }
]
```

**Errores**:
- `400`: userId es requerido

---

## 📊 Vistas Avanzadas

### EJERCICIO 1: Canciones Populares por País
Muestra las canciones más reproducidas agrupadas por país de origen de los usuarios.

**Endpoint**: `GET /vistas/canciones-populares-por-pais`

**Acceso**: Público

**Query Parameters** (opcional):
- `pais`: Filtrar por un país específico
- `limit`: Limitar cantidad de resultados

**Ejemplos**:
```
GET /vistas/canciones-populares-por-pais
GET /vistas/canciones-populares-por-pais?pais=Argentina
GET /vistas/canciones-populares-por-pais?limit=10
```

**Respuesta Exitosa** (200):
```json
[
  {
    "nombre_cancion": "Comfortably Numb",
    "nombre_artista": "Pink Floyd",
    "nombre_album": "The Wall",
    "nombre_pais": "Argentina",
    "total_reproducciones": 15420,
    "apariciones_en_playlists": 87
  },
  {
    "nombre_cancion": "Bohemian Rhapsody",
    "nombre_artista": "Queen",
    "nombre_album": "A Night at the Opera",
    "nombre_pais": "Argentina",
    "total_reproducciones": 12350,
    "apariciones_en_playlists": 65
  },
  {
    "nombre_cancion": "Stairway to Heaven",
    "nombre_artista": "Led Zeppelin",
    "nombre_album": "Led Zeppelin IV",
    "nombre_pais": "Estados Unidos",
    "total_reproducciones": 18900,
    "apariciones_en_playlists": 102
  }
]
```

**Descripción de los campos**:
- `nombre_cancion`: Título de la canción
- `nombre_artista`: Nombre del artista principal
- `nombre_album`: Álbum al que pertenece
- `nombre_pais`: País de origen de los usuarios que la reproducen
- `total_reproducciones`: Número total de veces que fue reproducida
- `apariciones_en_playlists`: En cuántas playlists activas aparece

**Query SQL utilizada**:
```sql
SELECT 
    c.title AS nombre_cancion,
    ar.name AS nombre_artista,
    al.title AS nombre_album,
    co.name AS nombre_pais,
    COUNT(lh.id) AS total_reproducciones,
    COUNT(DISTINCT ps.playlist_id) AS apariciones_en_playlists
FROM listening_history lh
JOIN user u ON lh.user_id = u.id
JOIN country co ON u.country_id = co.id
JOIN song c ON lh.song_id = c.id
JOIN album al ON c.album_id = al.id
JOIN artist ar ON c.artist_id = ar.id
LEFT JOIN playlist_song ps ON c.id = ps.song_id
LEFT JOIN playlist p ON ps.playlist_id = p.id AND p.is_deleted = 0
GROUP BY co.id, c.id, ar.id, al.id
ORDER BY co.name, total_reproducciones DESC
```

---

### EJERCICIO 2: Ingresos por Artista y Discográfica
Analiza los ingresos generados por cada combinación artista-discográfica.

**Endpoint**: `GET /vistas/ingresos-por-artista-discografica`

**Acceso**: Público

**Query Parameters** (opcional):
- `pais`: Filtrar por país de la discográfica
- `minimo_ingresos`: Filtrar por monto mínimo de ingresos
- `orden`: Ordenar por ('ingresos' o 'suscripciones')
- `page`: Número de página
- `limit`: Cantidad de resultados por página

**Ejemplos**:
```
GET /vistas/ingresos-por-artista-discografica
GET /vistas/ingresos-por-artista-discografica?pais=Argentina
GET /vistas/ingresos-por-artista-discografica?minimo_ingresos=50
GET /vistas/ingresos-por-artista-discografica?orden=suscripciones
GET /vistas/ingresos-por-artista-discografica?page=1&limit=5
```

**Respuesta Exitosa** (200):
```json
[
  {
    "nombre_artista": "Pink Floyd",
    "nombre_discografica": "Sony Music",
    "nombre_pais_discografica": "Estados Unidos",
    "total_ingresos": 125487.50,
    "cantidad_suscripciones_activas": 450,
    "total_canciones": 147,
    "promedio_reproducciones": 8542.3
  },
  {
    "nombre_artista": "The Beatles",
    "nombre_discografica": "Universal Music",
    "nombre_pais_discografica": "Estados Unidos",
    "total_ingresos": 98765.20,
    "cantidad_suscripciones_activas": 380,
    "total_canciones": 213,
    "promedio_reproducciones": 7891.5
  },
  {
    "nombre_artista": "Soda Stereo",
    "nombre_discografica": "Sony Music Argentina",
    "nombre_pais_discografica": "Argentina",
    "total_ingresos": 45320.80,
    "cantidad_suscripciones_activas": 210,
    "total_canciones": 89,
    "promedio_reproducciones": 5234.7
  }
]
```

**Descripción de los campos**:
- `nombre_artista`: Nombre del artista
- `nombre_discografica`: Nombre de la discográfica
- `nombre_pais_discografica`: País de origen de la discográfica
- `total_ingresos`: Suma total de ingresos generados por pagos
- `cantidad_suscripciones_activas`: Número de suscripciones vigentes (donde `renewal_date > NOW()`)
- `total_canciones`: Cantidad de canciones del artista en esa discográfica
- `promedio_reproducciones`: Promedio de reproducciones por canción

**Filtros aplicados**:
- Solo suscripciones vigentes (`renewal_date > NOW()`)
- Solo playlists activas (`is_deleted = 0`)

**Query SQL utilizada**:
```sql
SELECT 
    ar.name AS nombre_artista,
    rl.name AS nombre_discografica,
    co.name AS nombre_pais_discografica,
    SUM(b.amount) AS total_ingresos,
    COUNT(DISTINCT s.id) AS cantidad_suscripciones_activas,
    COUNT(DISTINCT song.id) AS total_canciones,
    AVG(lh.total_plays) AS promedio_reproducciones
FROM billing b
JOIN subscription s ON b.subscription_id = s.id
JOIN user u ON s.user_id = u.id
JOIN playlist p ON u.id = p.user_id AND p.is_deleted = 0
JOIN playlist_song ps ON p.id = ps.playlist_id
JOIN song ON ps.song_id = song.id
JOIN album al ON song.album_id = al.id
JOIN artist ar ON al.artist_id = ar.id
JOIN record_label rl ON al.label_id = rl.id
JOIN country co ON rl.country_id = co.id
LEFT JOIN (
    SELECT song_id, COUNT(*) as total_plays
    FROM listening_history
    GROUP BY song_id
) lh ON song.id = lh.song_id
WHERE ADDDATE(s.start_date, INTERVAL s.renewed_times MONTH) > NOW()
GROUP BY ar.id, rl.id, co.id
ORDER BY total_ingresos DESC
```

---

## 🔄 Códigos de Estado HTTP

### Respuestas Exitosas
- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente

### Errores del Cliente
- `400 Bad Request`: Datos faltantes o inválidos
- `401 Unauthorized`: No autenticado (token faltante o inválido)
- `403 Forbidden`: No autorizado (sin permisos)
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto de unicidad (duplicado)
- `422 Unprocessable Entity`: Estructura semánticamente inválida

### Errores del Servidor
- `500 Internal Server Error`: Error interno del servidor

---

## ⚠️ Formato de Errores

Todos los errores siguen este formato JSON:

```json
{
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

**Ejemplos**:

### Error 400 - Bad Request
```json
{
  "message": "Email and password are required."
}
```

### Error 401 - Unauthorized
```json
{
  "message": "Access denied. No token provided."
}
```

### Error 404 - Not Found
```json
{
  "message": "User not found."
}
```

### Error 409 - Conflict
```json
{
  "message": "Email already in use."
}
```

---

## 🔐 Autenticación con JWT

### Cómo usar el token

1. **Obtener el token**: Hacer login en `/users/login`
2. **Incluir en headers**: Para endpoints protegidos 🔒

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Duración del token
- **Expiración**: 1 hora
- **Renovación**: Hacer login nuevamente

### Payload del token
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "role": "FREE",
  "iat": 1729684800,
  "exp": 1729688400
}
```

---

## 📝 Notas Importantes

### Validaciones Implementadas

✅ **Email único** en usuarios  
✅ **Duración en segundos (INT)** para canciones  
✅ **UNIQUE (artista, título)** para álbumes  
✅ **Soft delete coherente** en playlists  
✅ **Tarjetas enmascaradas** sin CVC  
✅ **Fechas válidas** en suscripciones  
✅ **Hasheo de contraseñas** con bcrypt (10 rounds)

### Reglas de Negocio

- Las **contraseñas** nunca se devuelven en las respuestas
- Las **playlists eliminadas** tienen `is_deleted=true` y `deleted_at` con fecha
- Los **métodos de pago** solo guardan últimos 4 dígitos
- Las **canciones** se ordenan en playlists con `order_in_playlist`
- Las **suscripciones** deben tener `renewal_date > start_date`

---

## 🗄️ Modelo de Datos

### Tablas Principales

```
country
├── user
│   ├── playlist
│   │   └── playlist_song (M:N con song)
│   ├── subscription
│   │   └── billing
│   ├── payment_method
│   └── listening_history
│
artist
└── album
    ├── song
    │   └── song_genre (M:N con genre)
    └── record_label
│
genre
```

### Relaciones Clave

- `user` → `country` (N:1)
- `user` → `playlist` (1:N)
- `playlist` → `song` (N:M) a través de `playlist_song`
- `artist` → `album` (1:N)
- `album` → `song` (1:N)
- `album` → `record_label` (N:1)
- `song` → `genre` (N:M) a través de `song_genre`
- `user` → `subscription` (1:N)
- `subscription` → `billing` (1:N)
- `user` → `listening_history` (1:N)

---

## 🚀 Ejemplos de Uso Completo

### Flujo típico de un usuario nuevo

```http
### 1. Registro
POST http://localhost:3000/api/v2/users/register
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "password": "miPassword123!",
  "country_id": 1
}

### 2. Login
POST http://localhost:3000/api/v2/users/login
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "password": "miPassword123!"
}
# Guardar el token de la respuesta

### 3. Crear una playlist
POST http://localhost:3000/api/v2/playlists
Content-Type: application/json
Authorization: Bearer <tu_token>

{
  "name": "Mi Primera Playlist",
  "user_id": 1
}

### 4. Buscar canciones
GET http://localhost:3000/api/v2/songs?genres=Rock

### 5. Agregar canciones a la playlist
POST http://localhost:3000/api/v2/playlists/1/songs
Content-Type: application/json
Authorization: Bearer <tu_token>

{
  "song_id": 5
}

### 6. Ver la playlist completa
GET http://localhost:3000/api/v2/playlists/1
```

---

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en GitHub:
https://github.com/MannerAh/Trabajo-Integrador-Spotify-Backend/issues

---

## 📄 Licencia

Este proyecto es parte de un trabajo integrador educativo.

---

**Última actualización**: Octubre 2024  
**Versión de la API**: v2  
**Autor**: MannerAh