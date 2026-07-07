import dotenv from "dotenv";
dotenv.config();
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../utils/s3.js";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;

export const uploadToS3 = async (file) => {
  if (!bucketName || !region) {
    throw new Error("AWS S3 bucket configuration is missing.");
  }

  const key = Date.now() + "-" + file.originalname;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return { key, fileUrl };
};

export const deleteFromS3 = async (key) => {
  if (!bucketName) {
    throw new Error("AWS S3 bucket configuration is missing.");
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
};

export const downloadFileFromS3 = async (key) => {
  if (!bucketName) {
    throw new Error("AWS S3 bucket configuration is missing.");
  }

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );

  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};