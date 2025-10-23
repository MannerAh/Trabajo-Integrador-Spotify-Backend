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
      "email": "usuario@example.com"
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
Actualiza el nombre o estado de una playlist.

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