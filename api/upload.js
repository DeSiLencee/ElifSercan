import { handleUpload } from "@vercel/blob/client";

export default function handler(req, res) {
  return handleUpload({
    request: req,
    response: res,
    body: {
      tokenPayload: JSON.stringify({}),
    },
  });
}