import {
  CreateBucketCommand,
  HeadBucketCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

export function getStorage() {
  return new S3Client({
    region: process.env.MINIO_REGION ?? "us-east-1",
    endpoint: requiredEnv("MINIO_ENDPOINT"),
    forcePathStyle: true,
    credentials: {
      accessKeyId: requiredEnv("MINIO_ACCESS_KEY"),
      secretAccessKey: requiredEnv("MINIO_SECRET_KEY"),
    },
  });
}

export async function ensureBucket(bucket = process.env.MINIO_BUCKET ?? "app") {
  const client = getStorage();

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: bucket }));
  }

  return bucket;
}
