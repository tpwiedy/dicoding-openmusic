const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  // Menambahkan Playlist
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const result = await this._pool.query({
      text: `INSERT INTO playlists
             VALUES($1, $2, $3)
             RETURNING id`,
      values: [id, name, owner],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // Menampilkan Playlist
  async getPlaylists(user) {
    const result = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists 
             LEFT JOIN users ON users.id = playlists.owner 
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id 
             WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [user],
    });
    return result.rows;
  }
  // Menampilkan spesifik playlist
  async getPlaylistsById(id) {
    const result = await this._pool.query({
      text: `SELECT playlists.id,playlists.name, users.username
             FROM playlists
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1`,
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows[0];
  }

  // Menghapus Playlist
  async deletePlaylistById(id) {
    const result = await this._pool.query({
      text: `DELETE FROM playlists 
             WHERE id = $1 
             RETURNING id`,
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  // Menambahkan lagu ke playlist
  async addSongToPlaylist(id, songId) {
    const result = await this._pool.query({
      text: `INSERT INTO playlist_songs (playlist_id, song_id)
             VALUES($1, $2) 
             RETURNING id`,
      values: [id, songId],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  // Menampilkan lagu dari playlist
  async getSongsFromPlaylist(playlistId) {
    const resultPlaylist = await this._pool.query({
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1`,
      values: [playlistId],
    });

    const result = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer
             FROM songs
             JOIN playlist_songs ON songs.id = playlist_songs.song_id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    });

    return { ...resultPlaylist.rows[0], songs: result.rows };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const result = await this._pool.query({
      text: `DELETE FROM playlist_songs
             WHERE playlist_id = $1 AND song_id = $2
             RETURNING id`,
      values: [playlistId, songId],
    });

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }
  // Menambahkan aktivitas pada playlist
  async addActivityToPlaylist({ playlistId, songId, credentialId, action }) {
    const query = {
      text: `INSERT INTO playlist_activities (playlist_id, song_id, user_id, action) 
             VALUES($1, $2, $3, $4) 
             RETURNING id`,
      values: [playlistId, songId, credentialId, action],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan aktivitas pada playlist');
    }
  }

  // Menampilkan aktivitas pada playlist
  async getActivitiesInPlaylist(playlistId) {
    const result = await this._pool.query({
      text: `SELECT users.username, songs.title, action, time
             FROM playlist_activities
             JOIN songs ON songs.id = playlist_activities.song_id
             JOIN users ON users.id = playlist_activities.user_id
             WHERE playlist_activities.playlist_id = $1`,
      values: [playlistId],
    });

    return result.rows;
  }
  // Verifikasi Owner Playlist
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: `SELECT *
             FROM playlists
             WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  // Verifikasi akses kolabolator
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}
module.exports = PlaylistsService;
