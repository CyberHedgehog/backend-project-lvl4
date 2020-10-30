import getApp from '../index';

const port = process.env.PORT || 3000;
const app = getApp();
console.log(port);
app.listen(port, '0.0.0.0').then(console.log);
