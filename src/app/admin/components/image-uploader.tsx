'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function getFirebaseStorageErrorMessage(error: any): string {
    switch (error.code) {
        case 'storage/unauthorized':
            return "Permission Denied: You do not have permission to upload files. Please ensure you are logged in as an admin and that your Storage Security Rules are correctly published in the Firebase Console.";
        case 'storage/object-not-found':
            return "File Not Found: The file may have been moved or deleted.";
        case 'storage/bucket-not-found':
            return "Storage Bucket Not Found: Please ensure Firebase Storage is set up correctly in your project.";
        case 'storage/project-not-found':
            return "Firebase Project Not Found: Please check your Firebase configuration.";
        case 'storage/quota-exceeded':
            return "Storage Quota Exceeded: Please upgrade your storage plan or free up space.";
        case 'storage/unauthenticated':
            return "User Not Authenticated: Please log in to upload files.";
        case 'storage/canceled':
            return "Upload Canceled.";
        case 'storage/retry-limit-exceeded':
             return "Connection Timed Out: The network connection has been lost. Please check your internet connection and firewall settings.";
        case 'storage/invalid-url':
            return "Invalid URL: The URL for the file is malformed.";
        case 'storage/unknown':
            return "An unknown error occurred. This is often due to a CORS configuration issue. Please verify that your Storage bucket's CORS policy is set correctly in the Google Cloud Console to allow requests from your app's domain.";
        default:
            return error.message || "An unexpected error occurred during upload. Please check the browser console for more details.";
    }
}

export default function ImageUploader({ 
    existingImageUrls = [], 
    onImageUrlsChange,
    onUploadStateChange
}: {
    existingImageUrls?: string[];
    onImageUrlsChange: React.Dispatch<React.SetStateAction<string[]>>;
    onUploadStateChange: (isUploading: boolean) => void;
}) {
  const storage = useStorage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!storage || isUploading || acceptedFiles.length === 0) return;

    setIsUploading(true);
    onUploadStateChange(true);

    const uploadPromises = acceptedFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const uniqueId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uniqueId}.${fileExtension}`;
        const filePath = `products/${fileName}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => { /* Optional: Handle progress */ },
          (error) => {
            // This is the Firebase SDK's error handler
            console.error(`Upload failed for ${file.name}:`, error);
            const friendlyMessage = getFirebaseStorageErrorMessage(error);
            toast({
              variant: 'destructive',
              title: `Upload Failed: ${file.name}`,
              description: friendlyMessage,
              duration: 10000,
            });
            reject(new Error(friendlyMessage));
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              console.error(`Failed to get download URL for ${file.name}:`, error);
              const friendlyMessage = getFirebaseStorageErrorMessage(error);
               toast({
                variant: 'destructive',
                title: `Could Not Get URL for ${file.name}`,
                description: friendlyMessage,
                duration: 10000,
              });
              reject(new Error(friendlyMessage));
            }
          }
        );
      });
    });

    const allUploadsPromise = Promise.all(uploadPromises);

    const timeoutPromise = new Promise<string[]>((_, reject) =>
      setTimeout(() => {
        reject(new Error('Upload timed out after 15 seconds. This is most likely due to a CORS configuration issue on your Cloud Storage bucket.'));
      }, 15000)
    );

    try {
      toast({
        title: `Uploading ${acceptedFiles.length} file(s)...`,
        description: 'Your upload has started.',
      });
      const uploadedUrls = await Promise.race([allUploadsPromise, timeoutPromise]);
      onImageUrlsChange(prevUrls => [...prevUrls, ...uploadedUrls]);
      toast({
        title: 'Upload Successful',
        description: `${acceptedFiles.length} file(s) have been uploaded.`,
      });
    } catch (error: any) {
      console.error("Upload process failed:", error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred.',
        duration: 10000
      });
    } finally {
      setIsUploading(false);
      onUploadStateChange(false);
    }
  }, [storage, isUploading, onImageUrlsChange, onUploadStateChange, toast]);


  const handleRemoveImage = (urlToRemove: string) => {
    onImageUrlsChange((prevUrls) => prevUrls.filter((url) => url !== urlToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: true,
    disabled: isUploading
  });

  return (
    <div className="space-y-4">
        <div
            {...getRootProps()}
            className={`flex justify-center w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isUploading 
                ? 'cursor-not-allowed bg-muted/50'
                : isDragActive 
                ? 'border-primary bg-primary/10 cursor-copy' 
                : 'border-border hover:border-primary/50 cursor-pointer'
            }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-8 w-8" />
            {isDragActive 
                ? <p>Drop the files here...</p> 
                : <p>{isUploading ? 'Uploading...' : 'Drag & drop images here, or click to select'}</p>
            }
            </div>
        </div>
      
      {existingImageUrls.length > 0 && (
        <div className="space-y-2">
            <Label>Uploaded Images</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
                <div key={url} className="relative group aspect-square">
                    <Image src={url} alt="Uploaded product image" fill className="object-cover rounded-md border" sizes="150px" />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(url)}
                        disabled={isUploading}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                    </Button>
                </div>
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
