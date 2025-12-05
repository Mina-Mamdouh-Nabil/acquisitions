import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure for Neon Local if in development with specific connection string
const isDevelopment = process.env.NODE_ENV === 'development';
const isNeonLocal = process.env.DATABASE_URL?.includes('neon:npg@');

if (isDevelopment && isNeonLocal) {
  // Extract host from DATABASE_URL for Neon Local
  const dbUrl = new URL(process.env.DATABASE_URL);
  const host = dbUrl.hostname;
  const port = dbUrl.port || '5432';
  
  // Configure Neon serverless for Neon Local
  neonConfig.fetchEndpoint = `http://${host}:${port}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };
