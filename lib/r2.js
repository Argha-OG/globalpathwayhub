import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Cloudflare R2 bucket configuration
// R2 uses the S3-compatible API with a Cloudflare-specific endpoint
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'gph';

// Public URL base for serving assets. Use custom domain if available, else public dev URL.
export const R2_PUBLIC_URL =
  process.env.R2_PUBLIC_URL ||
  'https://pub-62824071403f4f6ebb69c83b5dbef798.r2.dev';

let r2Client;

function getR2Client() {
  if (r2Client) return r2Client;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error(
      'R2 credentials not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in your .env file.'
    );
  }

  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  return r2Client;
}

/**
 * Upload a file buffer to Cloudflare R2.
 * @param {Buffer} buffer - The file content as a Buffer.
 * @param {string} key - The object key (path) in the bucket, e.g. "logos/1234-file.jpg".
 * @param {string} contentType - MIME type of the file, e.g. "image/jpeg".
 * @returns {Promise<string>} The public URL of the uploaded object.
 */
export async function uploadToR2(buffer, key, contentType) {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Delete an object from Cloudflare R2.
 * @param {string} key - The object key to delete.
 */
export async function deleteFromR2(key) {
  try {
    const client = getR2Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (err) {
    // Log but don't throw — a missing object shouldn't block other operations.
    console.warn(`[R2] Failed to delete object "${key}":`, err.message);
  }
}

/**
 * Extract the R2 object key from a full public URL.
 * Returns null if the URL doesn't belong to this R2 bucket.
 * @param {string} url
 * @returns {string|null}
 */
export function getKeyFromUrl(url) {
  if (!url) return null;
  if (url.startsWith(R2_PUBLIC_URL + '/')) {
    return url.slice(R2_PUBLIC_URL.length + 1);
  }
  return null;
}

/**
 * Retrieve real-time Cloudflare R2 bucket storage metrics and capacity limits.
 * @returns {Promise<{connected: boolean, bucketName: string, objectCount: number, usedBytes: number, limitBytes: number, usagePercent: number, usedPretty: string, limitPretty: string}>}
 */
export async function getR2StorageStats() {
  try {
    const client = getR2Client();
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
      })
    );

    const objectCount = res.KeyCount || (res.Contents ? res.Contents.length : 0);
    const usedBytes = (res.Contents || []).reduce((acc, obj) => acc + (obj.Size || 0), 0);
    const limitBytes = Number(process.env.R2_STORAGE_LIMIT_BYTES) || 10 * 1024 * 1024 * 1024; // 10 GB Standard Free Tier

    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
      connected: true,
      bucketName: R2_BUCKET_NAME,
      objectCount,
      usedBytes,
      usedPretty: formatBytes(usedBytes),
      limitBytes,
      limitPretty: formatBytes(limitBytes),
      usagePercent: Number(((usedBytes / limitBytes) * 100).toFixed(3)),
    };
  } catch (err) {
    console.error('[R2] Failed to get storage stats:', err.message);
    return {
      connected: false,
      bucketName: R2_BUCKET_NAME,
      objectCount: 0,
      usedBytes: 0,
      usedPretty: '0 B',
      limitBytes: 10 * 1024 * 1024 * 1024,
      limitPretty: '10 GB',
      usagePercent: 0,
      error: err.message,
    };
  }
}

