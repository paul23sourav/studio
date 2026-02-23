'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@/firebase';
import { uploadFile } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface Upload {
  file: File;
  progress: number;
}

interface ImageUploaderProps {
  existingImageUrls?: string[];
  onImageUrlsChange: (urls: string[]) => void;
}

export default function ImageUploader({ existingImageUrls = [], onImageUrlsChange }: ImageUploaderProps) {
  const { toast } = useToast();
  const storage = useStorage();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveImage = (urlToRemove: string) => {
    const newUrls = existingImageUrls.filter(url => url !== urlToRemove);
    onImageUrlsChange(newUrls);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    if (!storage) {
      toast({
          variant: 'destructive',
          title: 'Storage not available',
          description: 'Firebase Storage is not configured correctly.',
      });
      return;
    }

    setIsUploading(true);
    const newUploads: Upload[] = acceptedFiles.map(file => ({ file, progress: 0 }));
    setUploads(newUploads);
    
    const uploadPromises = newUploads.map(async (upload) => {
        const uniqueId = uuidv4();
        const nameParts = upload.file.name.split('.');
        const fileExtension = nameParts.length > 1 ? nameParts.pop() : '';
        const fileName = `${uniqueId}${fileExtension ? `.${fileExtension}` : ''}`;
        const filePath = `products/${fileName}`;

        try {
            const url = await uploadFile(storage, upload.file, filePath, (p) => {
                setUploads(prev => 
                    prev.map(u => 
                        u.file.name === upload.file.name && u.file.size === upload.file.size 
                        ? {...u, progress: p} 
                        : u
                    )
                );
            });
            return url;
        } catch (error) {
            // This error will be caught by the outer Promise.all handler
            throw error;
        }
    });

    try {
        const newUrls = await Promise.all(uploadPromises);
        onImageUrlsChange([...existingImageUrls, ...newUrls]);
        toast({
            title: 'Images uploaded',
            description: `${newUrls.length} image(s) have been successfully uploaded.`,
        });
    } catch (error) {
        console.error("Upload failed:", error);
        toast({
            variant: 'destructive',
            title: 'Upload failed',
            description: 'There was a problem uploading one or more images. Please check permissions and try again.',
        });
    } finally {
        setIsUploading(false);
        setUploads([]);
    }
  }, [storage, existingImageUrls, onImageUrlsChange, toast]);

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
      
      {isUploading && (
        <div className="space-y-4">
            {uploads.map((upload, index) => (
              <div key={`${upload.file.name}-${index}`} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <Label className="truncate max-w-[200px] sm:max-w-xs">{upload.file.name}</Label>
                    <span className="text-muted-foreground">{Math.round(upload.progress)}%</span>
                  </div>
                  <Progress value={upload.progress} />
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
