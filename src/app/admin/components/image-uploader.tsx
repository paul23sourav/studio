'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  existingImageUrls?: string[];
  onImageUrlsChange: (urls: string[]) => void;
}

export default function ImageUploader({ existingImageUrls = [], onImageUrlsChange }: ImageUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRemoveImage = (urlToRemove: string) => {
    // Note: This only removes from the UI state. Deleting from storage is handled when the product is saved/deleted.
    const newUrls = existingImageUrls.filter(url => url !== urlToRemove);
    onImageUrlsChange(newUrls);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    const file = acceptedFiles[0];
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uniqueId}.${fileExtension}`;
    const filePath = `products/${fileName}`;

    try {
      const downloadUrl = await uploadFile(file, filePath, (p) => setProgress(p));
      onImageUrlsChange([...existingImageUrls, downloadUrl]);
      toast({
        title: 'Image uploaded',
        description: 'The image has been successfully uploaded.',
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was a problem uploading your image.',
      });
    } finally {
      setUploading(false);
    }
  }, [existingImageUrls, onImageUrlsChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false 
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex justify-center w-full rounded-lg border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <UploadCloud className="h-8 w-8" />
          {isDragActive ? <p>Drop the file here...</p> : <p>Drag & drop an image here, or click to select</p>}
        </div>
      </div>
      
      {uploading && (
        <div className="space-y-2">
            <Label>Uploading...</Label>
            <Progress value={progress} />
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
