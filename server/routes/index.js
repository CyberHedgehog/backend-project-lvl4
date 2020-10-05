import root from './root';
import users from './users';

const controllers = [
  root,
  users,
];

export default (app) => controllers.forEach((route) => route(app));
