'use client';

import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL
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
