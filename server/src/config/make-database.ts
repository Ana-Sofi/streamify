import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import {sql} from './postgress-conntection';

async function makeDatabase() {
  const dml = fs.readFileSync('./src/config/sql/streamify-dml.sql', {
    encoding: 'utf-8',
  });

  const result = await sql.unsafe(dml);
  await sql.end();
}

makeDatabase()
  .catch(() => console.log('Schema created!'))
  .catch(err => console.error(err));
