#! /usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import app from '../index';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const port = process.env.PORT || 3000;
const address = '0.0.0.0';

app.listen(port, address, () => {
  console.log(`Server is running on port: ${port}`);
});
