'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, UploadCloud, File, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@/firebase';
import { uploadFileResumable } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface Upload {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
}

function getFirebaseErrorMessage(error: any): string {
    if (error && typeof error === 'object' && 'code' in error) {
        switch (error.code) {
            case 'storage/unauthorized':
                return "Permission Denied: Check storage rules.";
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

export default function ImageUploader({ existingImageUrls = [], onImageUrlsChange }: {
    existingImageUrls?: string[];
    onImageUrlsChange: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { toast } = useToast();
  const storage = useStorage();
  const [uploads, setUploads] = useState<Upload[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!storage) {
        toast({ variant: 'destructive', title: 'Storage not available' });
        return;
    }

    const newUploads: Upload[] = acceptedFiles.map(file => ({
      id: uuidv4(),
      file,
      status: 'pending',
      progress: 0,
    }));

    setUploads(prev => [...prev, ...newUploads]);

    for (const upload of newUploads) {
      setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'uploading' } : u));
      
      try {
        const uniqueId = uuidv4();
        const nameParts = upload.file.name.split('.');
        const fileExtension = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
        const fileName = `${uniqueId}${fileExtension}`;
        const filePath = `products/${fileName}`;

        const downloadURL = await uploadFileResumable(
          storage,
          upload.file,
          filePath,
          (progress) => {
            setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, progress } : u));
          }
        );

        onImageUrlsChange(prevUrls => [...prevUrls, downloadURL]);
        setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'success', progress: 100 } : u));
      } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error(`Upload failed for ${upload.file.name}:`, error);
        setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error', error: errorMessage } : u));
      }
    }
  }, [storage, onImageUrlsChange, toast]);

  const handleRemoveImage = (urlToRemove: string) => {
    onImageUrlsChange((prevUrls) => prevUrls.filter((url) => url !== urlToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: true,
  });

  const isUploading = uploads.some(u => u.status === 'uploading' || u.status === 'pending');

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
            <input {...getInputProps()} disabled={isUploading} />
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

      {uploads.length > 0 && (
        <div className="space-y-2">
            <Label>Uploads</Label>
            <div className="space-y-4">
                {uploads.map(upload => (
                    <div key={upload.id} className="flex items-center gap-4 p-2 border rounded-lg">
                        <File className="h-8 w-8 text-muted-foreground"/>
                        <div className="flex-1">
                            <p className="text-sm font-medium truncate">{upload.file.name}</p>
                            {upload.status === 'uploading' && (
                                <Progress value={upload.progress} className="h-2 mt-1" />
                            )}
                            {upload.status === 'error' && (
                                <p className="text-xs text-destructive">{upload.error}</p>
                            )}
                        </div>
                        {upload.status === 'uploading' && (
                           <p className="text-sm font-medium">{Math.round(upload.progress)}%</p>
                        )}
                        {upload.status === 'success' && (
                            <CheckCircle2 className="h-5 w-5 text-green-500"/>
                        )}
                        {upload.status === 'error' && (
                            <AlertCircle className="h-5 w-5 text-destructive"/>
                        )}
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}