"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalFileUrl = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'attachments') {
            uploadPath += 'chat_attachments';
        }
        else if (file.fieldname === 'profile_image') {
            uploadPath += 'profile_images';
        }
        else if (file.fieldname === 'license_image') {
            uploadPath += 'license_images';
        }
        else if (file.fieldname === 'number_plate_image') {
            uploadPath += 'number_plate_images';
        }
        else if (file.fieldname === 'vehicle_images') {
            uploadPath += 'vehicle_images';
        }
        else if (file.fieldname === 'parcel_images') {
            uploadPath += 'parcel_images';
        }
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
const getLocalFileUrl = (filePath) => {
    const baseUrl = 'https://whxmt66k-5000.inc1.devtunnels.ms';
    const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\//, '');
    return `${baseUrl}/${normalizedPath}`;
};
exports.getLocalFileUrl = getLocalFileUrl;
//# sourceMappingURL=fileUploadHelper.js.map