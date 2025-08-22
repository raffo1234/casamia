import { S3Client } from "@aws-sdk/client-s3";

let r2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (r2Client) {
    return r2Client;
  }

  const CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
  const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (
    !CLOUDFLARE_R2_ENDPOINT ||
    !CLOUDFLARE_R2_ACCESS_KEY_ID ||
    !CLOUDFLARE_R2_SECRET_ACCESS_KEY
  ) {
    throw new Error("Missing one or more Cloudflare R2 environment variables.");
  }

  r2Client = new S3Client({
    endpoint: CLOUDFLARE_R2_ENDPOINT,
    region: "auto",
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  return r2Client;
}
