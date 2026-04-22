"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudFrontUrl = exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const env_config_1 = __importDefault(require("../config/env.config"));
/**
 * Configure and setup AWS S3 client
 */
const s3 = new client_s3_1.S3Client({
    region: env_config_1.default.aws_region,
    credentials: {
        accessKeyId: env_config_1.default.aws_access_key_id,
        secretAccessKey: env_config_1.default.aws_secret_access_key,
    },
});
/**
 * Setup file upload to AWS S3
 */
const uploadFile = () => {
    const fileFilter = (req, file, cb) => {
        const allowedFieldNames = [
            'attachments',
            'profile_image',
            'license_image',
            'number_plate_image',
            'vehicle_images',
            'parcel_images',
        ];
        // console.log('we get the file', file);
        if (file.fieldname === undefined) {
            // Allow requests without any files
            cb(null, true);
        }
        else if (allowedFieldNames.includes(file.fieldname)) {
            if (file.mimetype === 'image/jpeg' ||
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
                file.mimetype === 'video/x-matroska') {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type'));
            }
        }
        else {
            cb(new Error('Invalid fieldname'));
        }
    };
    const storage = (0, multer_s3_1.default)({
        s3: s3,
        bucket: env_config_1.default.aws_s3_bucket_name,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        // Removing ACL setting as your bucket doesn't support ACLs
        key: function (req, file, cb) {
            let uploadPath = '';
            // Maintain the same folder structure as before
            if (file.fieldname === 'attachments') {
                uploadPath = 'uploads/chat_attachments';
            }
            else if (file.fieldname === 'profile_image') {
                uploadPath = 'uploads/profile_images';
            }
            else if (file.fieldname === 'license_image') {
                uploadPath = 'uploads/license_images';
            }
            else if (file.fieldname === 'number_plate_image') {
                uploadPath = 'uploads/number_plate_images';
            }
            else if (file.fieldname === 'vehicle_images') {
                uploadPath = 'uploads/vehicle_images';
            }
            else if (file.fieldname === 'parcel_images') {
                uploadPath = 'uploads/parcel_images';
            }
            else {
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
    const upload = (0, multer_1.default)({
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
exports.uploadFile = uploadFile;
const getCloudFrontUrl = (s3FilePath) => {
    return `${env_config_1.default.cloudfront_url}/${s3FilePath}`;
};
exports.getCloudFrontUrl = getCloudFrontUrl;
//# sourceMappingURL=multer-s3-uploader.js.map