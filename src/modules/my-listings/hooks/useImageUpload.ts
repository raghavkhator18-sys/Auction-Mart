import { useState, useEffect, useCallback } from 'react';
import { MAX_IMAGES } from '../constants/listingConstants';

export const useImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [uploadedImages]);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const remaining = MAX_IMAGES - uploadedImages.length;
    const toAdd = Array.from(files)
      .filter(f => allowed.includes(f.type) && f.size <= 5 * 1024 * 1024)
      .slice(0, remaining);
    const newPreviews = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedImages(prev => [...prev, ...newPreviews]);
  }, [uploadedImages.length]);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearImages = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
  };

  return {
    uploadedImages,
    isDragOver,
    setIsDragOver,
    handleFileDrop,
    handleFileInput,
    removeImage,
    clearImages,
  };
};
