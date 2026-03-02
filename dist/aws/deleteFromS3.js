import { S3Client, HeadObjectCommand, DeleteObjectCommand, } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import configs from '../config/env.config';
dotenv.config();
// Initialize the S3 client
const s3 = new S3Client({
    region: configs.aws_region,
    credentials: {
        accessKeyId: configs.aws_access_key_id,
        secretAccessKey: configs.aws_secret_access_key,
    },
});
export const deleteFileFromS3 = async (fileName) => {
    const updatedFileName = fileName.split('cloudfront.net/')[1];
    if (!updatedFileName) {
        console.log('Invalid file name format.');
        return;
    }
    const decodedFileName = decodeURIComponent(updatedFileName);
    const bucket = configs.aws_s3_bucket_name;
    try {
        // 1. Check if the file exists in S3
        const headCommand = new HeadObjectCommand({
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
        const deleteCommand = new DeleteObjectCommand({
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
//# sourceMappingURL=deleteFromS3.js.map