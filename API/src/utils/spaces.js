const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const { v4: uuidv4 } = require('uuid');

const normalizeEndpoint = (value) => {
  if (!value) return '';
  return value.startsWith('http') ? value : `https://${value}`;
};

const endpoint = normalizeEndpoint(process.env.DO_SPACES_ENDPOINT);
const cdnEndpoint = process.env.DO_SPACES_CDN_ENDPOINT?.replace(/\/$/, '') || '';
const bucket = process.env.DO_SPACES_BUCKET;
const rootFolder = process.env.DO_SPACES_FOLDER?.replace(/^\/+|\/+$/g, '') || '';

const hasSpacesConfig = Boolean(
  process.env.DO_SPACES_KEY &&
    process.env.DO_SPACES_SECRET &&
    endpoint &&
    bucket
);

const client = hasSpacesConfig
  ? new S3Client({
      region: 'us-east-1',
      endpoint,
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
      },
    })
  : null;

const getKind = (mimetype = '') => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.startsWith('video/')) return 'video';
  return 'file';
};

const buildKey = (folder, originalName, mimetype) => {
  const extension = path.extname(originalName) || `.${mime.extension(mimetype) || 'bin'}`;
  const safeFolder = folder?.replace(/^\/+|\/+$/g, '') || 'misc';
  return [rootFolder, safeFolder, `${Date.now()}-${uuidv4()}${extension}`]
    .filter(Boolean)
    .join('/');
};

const getPublicUrl = (key) => {
  if (cdnEndpoint) return `${cdnEndpoint}/${key}`;
  return `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`;
};

const uploadBuffer = async ({ file, folder }) => {
  if (!hasSpacesConfig || !client) {
    throw new Error('DigitalOcean Spaces is not configured');
  }

  const key = buildKey(folder, file.originalname, file.mimetype);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    })
  );

  return {
    url: getPublicUrl(key),
    key,
    fileName: path.basename(key),
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    kind: getKind(file.mimetype),
  };
};

const deleteObject = async (key) => {
  if (!key || !hasSpacesConfig || !client) return;

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
};

module.exports = {
  deleteObject,
  getKind,
  hasSpacesConfig,
  uploadBuffer,
};