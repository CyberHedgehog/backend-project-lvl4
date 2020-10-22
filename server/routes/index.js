import root from './root';
import users from './users';
import session from './session';
import status from './status';
import tasks from './tasks';

const controllers = [
  root,
  users,
  session,
  status,
  tasks,
];

export default (app) => controllers.forEach((route) => route(app));
