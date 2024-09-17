const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadCoverAlbumHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    this._validator.validateImagesHeaders(cover.hapi.headers);

    // retrieve previouse cover album
    const oldCoverAlbum = await this._albumsService.getAlbumById(id);

    // upload new cover
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._albumsService.addCoverAlbum(id, filename);

    // delete previous cover album if exists
    const isCoverExists = oldCoverAlbum.cover;
    if (isCoverExists) {
      await this._storageService.deleteFile(isCoverExists);
    }

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
