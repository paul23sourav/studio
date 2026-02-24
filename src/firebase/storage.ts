'use client';

import {
  ref,
  getDownloadURL,
  Storage,
  uploadBytesResumable,
} from 'firebase/storage';

// This function is designed to run on the client.
export async function uploadFile(
  storage: Storage,
  file: File,
  path: string,
): Promise<string> {
  const storageRef = ref(storage, path);
  
  // `uploadBytesResumable` is "thenable" and can be awaited. 
  // It resolves with the snapshot on success or throws an error (e.g., for permission denied),
  // which will be caught by the calling function's try/catch block.
  const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
  
  // Once the upload is complete, get the download URL.
  const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
  
  return downloadURL;
}
