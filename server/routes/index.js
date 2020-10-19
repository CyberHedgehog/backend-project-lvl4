import root from './root';
import users from './users';
import session from './session';
import status from './status';

const controllers = [
  root,
  users,
  session,
  status,
];

export default (app) => controllers.forEach((route) => route(app));
