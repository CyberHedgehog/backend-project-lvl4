#! /usr/bin/env node

import app from '../index';

const port = process.env.PORT || 3000;
const address = '0.0.0.0';

app.listen(port, address, () => {
  console.log(`Server is running on port: ${port}`);
});
