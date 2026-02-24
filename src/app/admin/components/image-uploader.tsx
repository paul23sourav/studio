'use client';

import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@/firebase';
import { uploadFile } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface Upload {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface ImageUploaderProps {
  existingImageUrls?: string[];
  onImageUrlsChange: Dispatch<SetStateAction<string[]>>;
}

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

export default function ImageUploader({ existingImageUrls = [], onImageUrlsChange }: ImageUploaderProps) {
  const { toast } = useToast();
  const storage = useStorage();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveImage = (urlToRemove: string) => {
    onImageUrlsChange((prevUrls) => prevUrls.filter((url) => url !== urlToRemove));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    if (isUploading) {
      toast({
        variant: "destructive",
        title: "Upload in progress",
        description: "Please wait for the current batch to finish before adding more files.",
      });
      return;
    }
    
    if (!storage) {
      toast({
          variant: 'destructive',
          title: 'Storage not available',
          description: 'Firebase Storage is not configured correctly.',
      });
      return;
    }

    setIsUploading(true);
    const newUploads: Upload[] = acceptedFiles.map(file => ({ 
      id: uuidv4(), 
      file, 
      progress: 0,
      status: 'uploading'
    }));
    setUploads(newUploads);
    
    const successfulUrls: string[] = [];
    const failedFiles: { name: string; reason: string }[] = [];

    for (const upload of newUploads) {
      try {
        const uniqueId = uuidv4();
        const nameParts = upload.file.name.split('.');
        const fileExtension = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
        const fileName = `${uniqueId}${fileExtension}`;
        const filePath = `products/${fileName}`;

        const downloadURL = await uploadFile(storage, upload.file, filePath, (progress) => {
          setUploads(prev => 
            prev.map(u => u.id === upload.id ? {...u, progress } : u)
          );
        });

        successfulUrls.push(downloadURL);
        setUploads(prev => 
          prev.map(u => u.id === upload.id ? {...u, status: 'completed', progress: 100 } : u)
        );

      } catch (error) {
        const reason = getFirebaseErrorMessage(error);
        console.error(`Upload failed for ${upload.file.name}:`, error);
        failedFiles.push({ name: upload.file.name, reason });
        setUploads(prev => 
          prev.map(u => u.id === upload.id ? {...u, status: 'error' } : u)
        );
      }
    }
    
    if (successfulUrls.length > 0) {
      onImageUrlsChange(prev => [...prev, ...successfulUrls]);
    }

    if (failedFiles.length > 0) {
      toast({
        variant: 'destructive',
        title: `${failedFiles.length} file(s) failed to upload`,
        description: `The first error was: ${failedFiles[0].reason}`,
      });
    }

    if (successfulUrls.length > 0 && failedFiles.length === 0) {
      toast({
        title: 'Upload complete',
        description: `${successfulUrls.length} image(s) have been successfully uploaded.`,
      });
    }

    setIsUploading(false);
    // Keep uploads in state for a bit to show status, then clear.
    setTimeout(() => {
      setUploads([]);
    }, 5000);

  }, [storage, onImageUrlsChange, toast, isUploading]);

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
      
      {uploads.length > 0 && (
        <div className="space-y-2 pt-2">
            {uploads.map((upload) => (
              <div key={upload.id} className="relative rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {upload.status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                      {upload.status === 'error' && <AlertCircle className="h-6 w-6 text-destructive" />}
                      {upload.status === 'uploading' && (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{upload.file.name}</p>
                      {upload.status === 'uploading' && <Progress value={upload.progress} className="h-2" />}
                      {upload.status === 'error' && <p className="text-xs text-destructive">Upload Failed</p>}
                      {upload.status === 'completed' && <p className="text-xs text-green-600">Upload Complete</p>}
                    </div>
                    {upload.status === 'uploading' && <span className="text-sm font-mono text-muted-foreground">{Math.round(upload.progress)}%</span>}
                  </div>
              </div>
            ))}
        </div>
      )}

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
