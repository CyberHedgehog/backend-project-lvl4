import root from './root';
import users from './users';
import session from './session';
import status from './status';
import tasks from './tasks';
import labels from './labels';
import filter from './filter';

const controllers = [
  root,
  users,
  session,
  status,
  tasks,
  labels,
  filter,
];

export default (app) => controllers.forEach((route) => route(app));
