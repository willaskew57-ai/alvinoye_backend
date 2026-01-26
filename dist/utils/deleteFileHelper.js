import fs from 'fs';
import path from 'path';
/**
 * Deletes a file from the local storage
 * @param fileUrlOrPath - The full URL or relative path stored in the DB
 */
export const deleteLocalFile = (fileUrlOrPath) => {
    try {
        if (!fileUrlOrPath)
            return;
        let relativePath = fileUrlOrPath;
        //  If it's a full URL, extract only the path part
        // Example: https://whxmt66k-5000.inc1.devtunnels.ms/uploads/x.png -> /uploads/x.png
        if (fileUrlOrPath.includes('http')) {
            const url = new URL(fileUrlOrPath);
            relativePath = url.pathname;
        }
        //  Clean the path for the operating system
        // Remove the leading slash and normalize slashes for Windows/Linux
        const cleanedPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        // 3. Create the absolute path on your computer
        const fullPath = path.join(process.cwd(), cleanedPath);
        console.log('Attempting to delete file at:', fullPath);
        // 4. Check if file exists and delete
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
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
//# sourceMappingURL=deleteFileHelper.js.map