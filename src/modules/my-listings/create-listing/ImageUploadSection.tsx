import React, { useRef } from 'react';
import { ImageIcon, Upload, X, PlusCircle } from 'lucide-react';
import { FormSection } from './FormSection';
import { MAX_IMAGES } from '../constants/listingConstants';

interface ImageUploadSectionProps {
  uploadedImages: { file: File; preview: string }[];
  isDragOver: boolean;
  setIsDragOver: (val: boolean) => void;
  handleFileDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  uploadedImages,
  isDragOver,
  setIsDragOver,
  handleFileDrop,
  handleFileInput,
  removeImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <FormSection
      icon={<ImageIcon size={16} />}
      title="Product Images"
      subtitle={`Upload up to ${MAX_IMAGES} images · JPG, PNG, WEBP · Max 5 MB each`}
    >
      {/* Drag & Drop Zone */}
      {uploadedImages.length < MAX_IMAGES && (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 select-none ${isDragOver
            ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50/40'
            }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl transition-colors ${isDragOver ? 'bg-blue-100' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Upload size={22} className={isDragOver ? 'text-blue-600' : 'text-slate-400'} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Drag &amp; Drop Images Here
              </p>
              <p className="text-xs text-slate-400 mt-0.5">or</p>
              <span className="inline-block mt-1.5 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded-lg">
                Browse Files
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {MAX_IMAGES - uploadedImages.length} of {MAX_IMAGES} image slots remaining
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* Image Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className={`grid grid-cols-3 sm:grid-cols-5 gap-3 ${uploadedImages.length < MAX_IMAGES ? 'mt-4' : ''}`}>
          {uploadedImages.map((img, i) => (
            <div key={i} className="relative group aspect-square">
              <img
                src={img.preview}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-md">
                  Main
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {/* Add more button if below limit */}
          {uploadedImages.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer text-slate-400 hover:text-blue-600"
            >
              <PlusCircle size={18} />
              <span className="text-[9px] font-bold">Add</span>
            </button>
          )}
        </div>
      )}
    </FormSection>
  );
};
