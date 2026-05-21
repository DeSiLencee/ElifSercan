import { handleUpload } from "@vercel/blob/client";

export default function handler(req, res) {
  return handleUpload(req, res);
}