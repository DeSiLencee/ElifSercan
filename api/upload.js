import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { file } = req.body;

    const blob = await put(file.name, file, {
      access: "public",
    });

    return res.status(200).json({
      url: blob.url,
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}