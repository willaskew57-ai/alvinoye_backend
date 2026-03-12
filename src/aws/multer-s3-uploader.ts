/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import configs from '../config/env.config';

/**
 * Configure and setup AWS S3 client
 */
const s3 = new S3Client({
  region: configs.aws_region,
  credentials: {
    accessKeyId: configs.aws_access_key_id,
    secretAccessKey: configs.aws_secret_access_key,
  },
});

/**
 * Setup file upload to AWS S3
 */
export const uploadFile = () => {
  const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFieldNames = [
      'attachments',
      'profile_image',
      'license_image',
      'number_plate_image',
      'vehicle_images',
      'parcel_images',
    ];
    console.log('we get the file', file);
    if (file.fieldname === undefined) {
      // Allow requests without any files
      cb(null, true);
    } else if (allowedFieldNames.includes(file.fieldname)) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/mov' ||
        file.mimetype === 'video/quicktime' ||
        file.mimetype === 'video/mpeg' ||
        file.mimetype === 'video/ogg' ||
        file.mimetype === 'video/webm' ||
        file.mimetype === 'video/x-msvideo' ||
        file.mimetype === 'video/x-flv' ||
        file.mimetype === 'video/3gpp' ||
        file.mimetype === 'video/3gpp2' ||
        file.mimetype === 'video/x-matroska'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const storage = multerS3({
    s3: s3,
    bucket: configs.aws_s3_bucket_name,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // Removing ACL setting as your bucket doesn't support ACLs
    key: function (req, file, cb) {
      let uploadPath = '';

      // Maintain the same folder structure as before
      if (file.fieldname === 'attachments') {
        uploadPath = 'uploads/chat_attachments';
      } else if (file.fieldname === 'profile_image') {
        uploadPath = 'uploads/profile_images';
      } else if (file.fieldname === 'license_image') {
        uploadPath = 'uploads/license_images';
      } else if (file.fieldname === 'number_plate_image') {
        uploadPath = 'uploads/number_plate_images';
      } else if (file.fieldname === 'vehicle_images') {
        uploadPath = 'uploads/vehicle_images';
      } else if (file.fieldname === 'parcel_images') {
        uploadPath = 'uploads/parcel_images';
      } else {
        uploadPath = 'uploads';
      }

      // Sanitize the filename just like in the original code
      const sanitizedOriginalName = file.originalname
        .replace(/\s+/g, '_')
        .replace(/[^\w.-]+/g, '');

      const name = Date.now() + '-' + sanitizedOriginalName;

      // Construct the full S3 key (path + filename)
      const fullPath = `${uploadPath}/${name}`;

      cb(null, fullPath);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit, adjust as needed
    },
  }).fields([
    { name: 'attachments', maxCount: 10 },
    { name: 'profile_image', maxCount: 1 },
    { name: 'license_image', maxCount: 1 },
    { name: 'number_plate_image', maxCount: 1 },
    { name: 'vehicle_images', maxCount: 5 },
    { name: 'parcel_images', maxCount: 10 },
  ]);

  console.log(upload, 'uploaded log');

  return upload;
};

export const getCloudFrontUrl = (s3FilePath: string): string => {
  return `${configs.cloudfront_url}/${s3FilePath}`;
};
