import getApp from '../index';

const port = process.env.PORT || 3000;
const app = getApp();
console.log(process.env);
app.listen(port, '::').catch(console.log);
