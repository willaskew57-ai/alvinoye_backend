/**
 * Setup file upload to AWS S3
 */
export declare const uploadFile: () => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getCloudFrontUrl: (s3FilePath: string) => string;
//# sourceMappingURL=multer-s3-uploader.d.ts.map