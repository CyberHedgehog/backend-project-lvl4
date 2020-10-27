import root from './root';
import users from './users';
import session from './session';
import status from './status';
import tasks from './tasks';
import labels from './labels';

const controllers = [
  root,
  users,
  session,
  status,
  tasks,
  labels,
];

export default (app) => controllers.forEach((route) => route(app));
