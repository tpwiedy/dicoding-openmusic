const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { InvariantError } = require('../exceptions');
const { mapDBToModelAlbums } = require('../utils');
 
class AlbumsService { 
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year}) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSER INTO albums VALUES($1, $2, $3, $4, $5)',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if(!result.rows[0].id) { 
      throw new InvariantError('Album gagal ditambahkan');
    };

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModelAlbums);
  }


}

module.exports = AlbumsService;