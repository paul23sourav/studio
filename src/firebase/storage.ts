'use client';

import {
  ref,
  getDownloadURL,
  Storage,
  uploadBytes,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from 'firebase/storage';

// This function is designed to run on the client.
// It uses the simpler `uploadBytes` method to isolate potential issues
// with the more complex `uploadBytesResumable` logic.
export async function uploadFile(
  storage: Storage,
  file: File,
  path: string,
): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadResult = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(uploadResult.ref);
  return downloadURL;
}

// Resumable uploader that provides progress
export function uploadFileResumable(
  storage: Storage,
  file: File,
  path: string,
  onProgress: (progress: number) => void,
): Promise<string> {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
      }
    );
  });
}