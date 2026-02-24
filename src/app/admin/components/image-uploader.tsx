'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@/firebase';
import { uploadFile } from '@/firebase/storage';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function getFirebaseErrorMessage(error: any): string {
    if (error && typeof error === 'object' && 'code' in error) {
        switch (error.code) {
            case 'storage/unauthorized':
                return "Permission Denied: Check your storage rules in the Firebase console.";
            case 'storage/canceled':
                return "Upload canceled.";
            case 'storage/unknown':
                return 'An unknown error occurred.';
            default:
                return error.message || "An unknown Firebase Storage error occurred.";
        }
    } else if (error instanceof Error) {
        return error.message;
    }
    return "An unknown error occurred during upload.";
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

    let successCount = 0;
    let errorCount = 0;
    
    const uploadPromises = acceptedFiles.map(file => {
        const uniqueId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uniqueId}.${fileExtension}`;
        const filePath = `products/${fileName}`;
        return uploadFile(storage, file, filePath);
    });

    try {
        const results = await Promise.allSettled(uploadPromises);

        const newImageUrls: string[] = [];
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                newImageUrls.push(result.value);
                successCount++;
            } else {
                errorCount++;
                const fileName = acceptedFiles[index].name;
                const errorMessage = getFirebaseErrorMessage(result.reason);
                console.error(`Failed to upload ${fileName}:`, result.reason);
                toast({
                    variant: "destructive",
                    title: `Upload Failed: ${fileName}`,
                    description: errorMessage,
                });
            }
        });

        if (newImageUrls.length > 0) {
            onImageUrlsChange(prevUrls => [...prevUrls, ...newImageUrls]);
        }

    } catch (error) {
        console.error("An unexpected error occurred during the upload process:", error);
        toast({
            variant: "destructive",
            title: "Upload Process Error",
            description: "An unexpected error occurred. Please check the console.",
        });
    } finally {
        if (errorCount > 0) {
           toast({
                title: "Upload Complete",
                description: `${successCount} file(s) uploaded successfully, ${errorCount} failed.`,
            });
        } else if (successCount > 0) {
            toast({
                title: "Upload Successful",
                description: `All ${successCount} file(s) have been uploaded.`,
            });
        }

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
