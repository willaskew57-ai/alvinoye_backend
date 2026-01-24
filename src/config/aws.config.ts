import { S3Client } from '@aws-sdk/client-s3'
import configs from './env.config'

export const s3Client = new S3Client({
  region: configs.aws_region as string,
  credentials: {
    accessKeyId: configs.aws_access_key_id as string,
    secretAccessKey: configs.aws_secret_access_key as string,
  },

})
