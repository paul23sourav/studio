'use client';

import {
  ref,
  getDownloadURL,
  Storage,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage';

// This function is designed to run on the client.
export async function uploadFile(
  storage: Storage,
  file: File,
  path: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Can be used to display upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle unsuccessful uploads.
        // This is where Firebase Storage errors (like permission denied) will be caught.
        reject(error);
      },
      () => {
        // Handle successful uploads on complete.
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch(reject);
      }
    );
  });
}
