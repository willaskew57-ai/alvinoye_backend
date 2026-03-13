"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const env_config_1 = __importDefault(require("./env.config"));
exports.s3Client = new client_s3_1.S3Client({
    region: env_config_1.default.aws_region,
    credentials: {
        accessKeyId: env_config_1.default.aws_access_key_id,
        secretAccessKey: env_config_1.default.aws_secret_access_key,
    },
});
//# sourceMappingURL=aws.config.js.map