'use client';

import { useState, useCallback, Dispatch, SetStateAction } from 'react';
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
  id: string;
  file: File;
  progress: number;
}

interface ImageUploaderProps {
  existingImageUrls?: string[];
  onImageUrlsChange: Dispatch<SetStateAction<string[]>>;
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
    
    if (!storage) {
      toast({
          variant: 'destructive',
          title: 'Storage not available',
          description: 'Firebase Storage is not configured correctly.',
      });
      return;
    }

    setIsUploading(true);
    const newUploads: Upload[] = acceptedFiles.map(file => ({ id: uuidv4(), file, progress: 0 }));
    setUploads(newUploads);
    
    const uploadedUrls: string[] = [];
    let hadError = false;

    for (const upload of newUploads) {
      try {
        const uniqueId = uuidv4();
        const nameParts = upload.file.name.split('.');
        const fileExtension = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
        const fileName = `${uniqueId}${fileExtension}`;
        const filePath = `products/${fileName}`;
        
        const url = await uploadFile(storage, upload.file, filePath, (progress) => {
            setUploads(prev => 
                prev.map(u => 
                    u.id === upload.id
                    ? {...u, progress } 
                    : u
                )
            );
        });
        uploadedUrls.push(url);
      } catch(error) {
        hadError = true;
        console.error(`Upload failed for ${upload.file.name}:`, error);
      }
    }
    
    if (uploadedUrls.length > 0) {
        onImageUrlsChange(prevUrls => [...prevUrls, ...uploadedUrls]);
    }

    if (hadError) {
        toast({
            variant: 'destructive',
            title: 'Upload issue',
            description: `Some images failed to upload. ${uploadedUrls.length} succeeded.`,
        });
    } else {
         toast({
            title: 'Images uploaded',
            description: `${uploadedUrls.length} image(s) have been successfully uploaded.`,
        });
    }
   
    setIsUploading(false);
    setUploads([]);

  }, [storage, onImageUrlsChange, toast]);

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
        <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="space-y-1">
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
