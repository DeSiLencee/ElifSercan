import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const file = req.body;

    const blob = await put("upload.jpg", file, {
      access: "public",
    });

    res.status(200).json({
      url: blob.url
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}