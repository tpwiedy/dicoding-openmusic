const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadCoverAlbumHandler,
    options: {
      payload: {
        maxBytes: 512000,
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        parse: true
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

module.exports = routes;
