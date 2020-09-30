import root from './root';

const controllers = [
  root,
];

export default (app) => controllers.forEach((route) => route(app));
