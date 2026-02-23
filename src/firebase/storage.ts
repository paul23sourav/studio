'use client';

import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { getApp } from 'firebase/app';

// This function is designed to run on the client.
export async function uploadFile(
  file: File,
  path: string,
  onProgress: (progress: number) => void
): Promise<string> {
  const app = getApp();
  const storage = getStorage(app);
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

// This can be called from server actions or client components
export async function deleteFile(fileUrl: string): Promise<void> {
    const app = getApp();
    const storage = getStorage(app);
    try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
    } catch (error: any) {
        // It's okay if the file doesn't exist.
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting file from storage:", error);
            // We don't throw here to avoid blocking the main operation (e.g., product deletion)
            // if an image is already gone.
        }
    }
}
