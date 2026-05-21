import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);

    const blob = await put(`photo-${Date.now()}.jpg`, fileBuffer, {
      access: "public",
    });

    res.status(200).json({
      url: blob.url,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}