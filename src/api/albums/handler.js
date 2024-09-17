const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, songsService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validatePostAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const albumId = await this._albumsService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    // Retrieve album and its songs
    const album = await this._albumsService.getAlbumById(id);
    const songs = await this._songsService.getSongsByAlbumId(id);

    // Add cover url
    album.songs = songs;
    album.coverUrl = album.cover
      ? (album.coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${album.cover}`)
      : null;

    // Delete cover
    delete album.cover;

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validatePutAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;
    await this._albumsService.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postLikeAlbumHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._albumsService.addAlbumLike(credentialId, id);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async deleteLikeAlbumHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.deleteAlbumLike(credentialId, id);

    return {
      status: 'success',
      message: 'Batal menyukai album',
    };
  }

  async getLikesAlbumHandler(request, h) {
    const { id } = request.params;
    const { albumLikes } = await this._albumsService.getAlbumLikesById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: albumLikes.length,
      },
    });

    return response;
  }
}
module.exports = AlbumsHandler;
