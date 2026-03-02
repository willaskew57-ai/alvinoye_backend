import { S3Client } from '@aws-sdk/client-s3';
import configs from './env.config';
export const s3Client = new S3Client({
    region: configs.aws_region,
    credentials: {
        accessKeyId: configs.aws_access_key_id,
        secretAccessKey: configs.aws_secret_access_key,
    },
});
//# sourceMappingURL=aws.config.js.map