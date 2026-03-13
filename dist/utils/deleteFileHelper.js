"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocalFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Deletes a file from the local storage
 * @param fileUrlOrPath - The full URL or relative path stored in the DB
 */
const deleteLocalFile = (fileUrlOrPath) => {
    try {
        if (!fileUrlOrPath)
            return;
        let relativePath = fileUrlOrPath;
        if (fileUrlOrPath.includes('http')) {
            const url = new URL(fileUrlOrPath);
            relativePath = url.pathname;
        }
        const cleanedPath = relativePath.startsWith('/')
            ? relativePath.substring(1)
            : relativePath;
        const fullPath = path_1.default.join(process.cwd(), cleanedPath);
        console.log('Attempting to delete file at:', fullPath);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
            console.log('File deleted successfully');
        }
        else {
            console.warn('File not found at path:', fullPath);
        }
    }
    catch (error) {
        console.error('Error deleting file:', error);
    }
};
exports.deleteLocalFile = deleteLocalFile;
//# sourceMappingURL=deleteFileHelper.js.map