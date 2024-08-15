const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbums, mapDBToModelSongs } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    // Construct a query to retrieve the album from the database.
    const albumQuery = {
      text: 'SELECT id,name,year FROM albums WHERE id = $1',
      values: [id],
    };

    // Execute the album query and retrieve the result.
    const albumResult = await this._pool.query(albumQuery);

    // If no rows were returned, throw a NotFoundError.
    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Map the database result to a model object.
    const album = albumResult.rows.map(mapDBToModelAlbums)[0];

    // Construct a query to retrieve the songs associated with the album.
    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [album.id],
    };

    // Execute the songs query and retrieve the result.
    const songsResult = await this._pool.query(songsQuery);

    // Map the database result to an array of model objects.
    const songs = songsResult.rows.map(mapDBToModelSongs);

    // Create a response object that includes the album and its associated songs.
    const response = {
      ...album, // Spread the album properties into the response object.
      songs, // Add the songs array to the response object.
    };

    // Return the response object.
    return response;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id, name, year',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
