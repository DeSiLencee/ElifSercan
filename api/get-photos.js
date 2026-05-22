import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    // Ensure table exists
    await sql`CREATE TABLE IF NOT EXISTS photos (id SERIAL PRIMARY KEY, url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
    
    const { rows } = await sql`SELECT * FROM photos ORDER BY created_at DESC;`;
    
    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
