'use client';

import {
  ref,
  getDownloadURL,
  Storage,
  uploadBytesResumable,
} from 'firebase/storage';

// This function is designed to run on the client.
export function uploadFile(
  storage: Storage,
  file: File,
  path: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Can be used to display upload progress
      },
      (error) => {
        // This is the crucial part.
        // On any error, including permission errors, we reject the promise.
        console.error("Upload failed in promise:", error);
        reject(error);
      },
      () => {
        // On success, we get the download URL and resolve the promise.
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            console.error("Failed to get download URL:", error);
            reject(error);
          });
      }
    );
  });
}
