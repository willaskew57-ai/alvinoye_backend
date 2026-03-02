import fs from 'fs';
import path from 'path';

/**
 * Deletes a file from the local storage
 * @param fileUrlOrPath - The full URL or relative path stored in the DB
 */
export const deleteLocalFile = (fileUrlOrPath: string) => {
  try {
    if (!fileUrlOrPath) return;

    let relativePath = fileUrlOrPath;

    if (fileUrlOrPath.includes('http')) {
      const url = new URL(fileUrlOrPath);
      relativePath = url.pathname;
    }

    const cleanedPath = relativePath.startsWith('/')
      ? relativePath.substring(1)
      : relativePath;

    const fullPath = path.join(process.cwd(), cleanedPath);

    console.log('Attempting to delete file at:', fullPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('File deleted successfully');
    } else {
      console.warn('File not found at path:', fullPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
