const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  // Menambahkan kolaborasi
  async addCollaboration(playlistId, userId) {
    const id = `collabs-${nanoid(16)}`;

    const result = await this._pool.query({
      text: `INSERT INTO collaborations
             VALUES($1, $2, $3)
             RETURNING id`,
      values: [id, playlistId, userId],
    });
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // Menghapus kolaborasi
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `DELETE FROM collaborations
             WHERE playlist_id = $1 AND user_id = $2
             RETURNING id`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus. Id tidak ditemukan');
    }
  }

  // Mengecek apakah ada kolaborasi
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT * FROM collaborations
             WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(
        'Kolaborasi gagal diverifikasi. Id tidak ditemukan'
      );
    }
  }
}

module.exports = CollaborationsService;
