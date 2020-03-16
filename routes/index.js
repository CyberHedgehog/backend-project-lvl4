// import users from './users';
import welcome from './welcome';
import sessions from './sessions';
import users from './users';

const controllers = [welcome, sessions, users];

export default (router, container) => controllers.forEach((f) => f(router, container));
