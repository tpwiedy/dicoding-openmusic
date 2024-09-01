const UsersHandlder = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const usersHandler = new UsersHandlder(service, validator);
    server.route(routes(usersHandler));
  },
};
