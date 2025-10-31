import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import {sql} from './postgress-conntection';

async function seedDatabase() {
  const seeds = fs.readFileSync('./src/config/sql/streamify-seeds.sql', {
    encoding: 'utf-8',
  });

  await sql.unsafe(seeds);
  await sql.end();
}

seedDatabase()
  .then(() => console.log('Database seeded!'))
  .catch(err => console.error(err));
