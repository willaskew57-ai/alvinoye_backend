"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const env_config_1 = __importDefault(require("../config/env.config"));
dotenv_1.default.config();
// Initialize the S3 client
const s3 = new client_s3_1.S3Client({
    region: env_config_1.default.aws_region,
    credentials: {
        accessKeyId: env_config_1.default.aws_access_key_id,
        secretAccessKey: env_config_1.default.aws_secret_access_key,
    },
});
const deleteFileFromS3 = async (fileName) => {
    const updatedFileName = fileName.split('cloudfront.net/')[1];
    if (!updatedFileName) {
        console.log('Invalid file name format.');
        return;
    }
    const decodedFileName = decodeURIComponent(updatedFileName);
    const bucket = env_config_1.default.aws_s3_bucket_name;
    try {
        // 1. Check if the file exists in S3
        const headCommand = new client_s3_1.HeadObjectCommand({
            Bucket: bucket,
            Key: decodedFileName,
        });
        try {
            await s3.send(headCommand);
        }
        catch (err) {
            if (err.name === 'NotFound') {
                console.log(`File ${decodedFileName} does not exist in S3.`);
                return;
            }
            throw err;
        }
        // 2. Delete the file
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: bucket,
            Key: decodedFileName,
        });
        await s3.send(deleteCommand);
        console.log(`Successfully deleted ${decodedFileName} from S3`);
    }
    catch (err) {
        if (err.name === 'NotFound') {
            console.error(`File ${decodedFileName} was not found in S3.`);
        }
        else {
            console.error('Error deleting file from S3:', err);
        }
    }
};
exports.deleteFileFromS3 = deleteFileFromS3;
//# sourceMappingURL=deleteFromS3.js.map