import welcome from './welcome';
import sessions from './sessions';
import users from './users';
import tasks from './tasks';

const controllers = [welcome, sessions, users, tasks];

export default (router, container) => controllers.forEach((f) => f(router, container));
