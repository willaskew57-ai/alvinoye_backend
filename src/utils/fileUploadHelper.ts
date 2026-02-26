import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'attachments') {
      uploadPath += 'chat_attachments';
    } else if (file.fieldname === 'profile_image') {
      uploadPath += 'profile_images';
    } else if (file.fieldname === 'license_image') {
      uploadPath += 'license_images';
    } else if (file.fieldname === 'number_plate_image') {
      uploadPath += 'number_plate_images';
    } else if (file.fieldname === 'vehicle_images') {
      uploadPath += 'vehicle_images';
    } else if (file.fieldname === 'parcel_images') {
      uploadPath += 'parcel_images';
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage: storage });

export const getLocalFileUrl = (filePath: string): string => {
  const baseUrl = 'https://whxmt66k-5000.inc1.devtunnels.ms';
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\//, '');
  return `${baseUrl}/${normalizedPath}`;
};
