'use client';

import {
  ref,
  getDownloadURL,
  Storage,
  uploadBytes,
} from 'firebase/storage';

// This function is designed to run on the client.
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
