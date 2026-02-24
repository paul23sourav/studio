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

    const uploadedUrls: string[] = [];

    for (const file of acceptedFiles) {
      const uniqueId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uniqueId}.${fileExtension}`;
      const filePath = `products/${fileName}`;
      
      toast({
        title: `Uploading ${file.name}...`,
        description: 'Establishing connection...',
      });

      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        const uploadPromise = new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => { 
                  // This callback confirms the connection is active.
                  // It's intentionally left blank as we only need to know it's firing.
                 },
                (error) => reject(error),
                async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(url);
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        });

        const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('Connection timed out after 5 seconds. Please check your network configuration (firewall, proxy).')), 5000)
        );

        const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);

        uploadedUrls.push(downloadURL);
        toast({
          title: 'Upload Successful',
          description: `${file.name} has been uploaded.`,
        });
      } catch (error: any) {
        uploadTask.cancel();
        
        // Log the raw error object for maximum diagnostic information.
        console.error(`Upload failed for ${file.name}. Raw error object:`, error);
        
        // Display a more direct and technical error message.
        const errorMessage = error.message || 'An unknown error occurred. Check the browser console for details.';
        
        toast({
          variant: 'destructive',
          title: `Upload Failed: ${file.name}`,
          description: errorMessage,
        });

        // Stop the entire upload process if one file fails
        setIsUploading(false);
        onUploadStateChange(false);
        return; // Exit the loop
      }
    }

    if (uploadedUrls.length > 0) {
      onImageUrlsChange(prevUrls => [...prevUrls, ...uploadedUrls]);
    }

    setIsUploading(false);
    onUploadStateChange(false);

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
