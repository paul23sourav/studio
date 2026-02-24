'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@/firebase';
import { uploadFile } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Helper to get a descriptive error message from a Firebase error object
function getFirebaseErrorMessage(error: any): string {
    if (error && typeof error === 'object' && 'code' in error) {
        switch (error.code) {
            case 'storage/unauthorized':
                return "Permission denied. Check your Firebase Storage security rules to ensure you have write access.";
            case 'storage/object-not-found':
                return "File not found. This is an unexpected error during upload.";
            case 'storage/canceled':
                return "The upload was canceled.";
            default:
                return (error as any).message || "An unknown Firebase Storage error occurred.";
        }
    } else if (error instanceof Error) {
        return error.message;
    }
    return "An unknown error occurred during upload.";
}

export default function ImageUploader({ existingImageUrls = [], onImageUrlsChange }: {
    existingImageUrls?: string[];
    onImageUrlsChange: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { toast } = useToast();
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveImage = (urlToRemove: string) => {
    onImageUrlsChange((prevUrls) => prevUrls.filter((url) => url !== urlToRemove));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!storage || isUploading) return;

    setIsUploading(true);
    let successfulUrls: string[] = [];
    let failedCount = 0;
    let firstError = "";

    for (const file of acceptedFiles) {
        try {
            const uniqueId = uuidv4();
            const nameParts = file.name.split('.');
            const fileExtension = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
            const fileName = `${uniqueId}${fileExtension}`;
            const filePath = `products/${fileName}`;
            
            const downloadURL = await uploadFile(storage, file, filePath);
            successfulUrls.push(downloadURL);

        } catch (error) {
            const reason = getFirebaseErrorMessage(error);
            console.error(`Upload failed for ${file.name}:`, error);
            failedCount++;
            if (!firstError) firstError = reason;
        }
    }

    if (successfulUrls.length > 0) {
        onImageUrlsChange(prev => [...prev, ...successfulUrls]);
    }

    if (failedCount > 0) {
        toast({
            variant: "destructive",
            title: `${failedCount} file(s) failed to upload`,
            description: `Error: ${firstError}`,
        });
    }

    if (successfulUrls.length > 0 && failedCount === 0) {
        toast({
            title: "Upload complete",
            description: `${successfulUrls.length} image(s) uploaded.`,
        });
    }

    setIsUploading(false);
  }, [storage, isUploading, onImageUrlsChange, toast]);

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
