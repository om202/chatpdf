import {neon, neonConfig} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

if(!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found');
}

const sql = neon(process.env.DATABASE_URL);

// ignore this line for now
// @ts-ignore
export const db = drizzle(sql);
