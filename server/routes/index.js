import root from './root';
import users from './users';
import session from './session';

const controllers = [
  root,
  users,
  session,
];

export default (app) => controllers.forEach((route) => route(app));
