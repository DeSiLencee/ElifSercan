import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return new Response('Filename is required', { status: 400 });
    }

    // 1. Upload to Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    // 2. Save URL to Vercel Postgres
    // Note: This assumes a table named 'photos' exists with a 'url' column
    try {
      await sql`INSERT INTO photos (url) VALUES (${blob.url});`;
    } catch (dbError) {
      console.error('Database Error:', dbError);
      // We still return the blob URL even if DB fails for now, 
      // but in production we might want to handle this better.
    }

    return new Response(JSON.stringify(blob), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
