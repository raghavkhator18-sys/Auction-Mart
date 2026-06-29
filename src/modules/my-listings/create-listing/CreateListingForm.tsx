import React from 'react';
import { Gavel, X } from 'lucide-react';
import { BasicInformationSection } from './BasicInformationSection';
import { PricingSection } from './PricingSection';
import { ImageUploadSection } from './ImageUploadSection';
import { DescriptionSection } from './DescriptionSection';
import { FormActions } from './FormActions';

interface CreateListingFormProps {
  setIsFormOpen: (val: boolean) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  onSaveDraft: () => void;
  // Basic info state
  newTitle: string;
  setNewTitle: (val: string) => void;
  newCategory: string;
  setNewCategory: (val: string) => void;
  newCondition: string;
  setNewCondition: (val: string) => void;
  // Pricing state
  newPrice: string;
  setNewPrice: (val: string) => void;
  newReservePrice: string;
  setNewReservePrice: (val: string) => void;
  newDuration: number;
  setNewDuration: (val: number) => void;
  newSku: string;
  setNewSku: (val: string) => void;
  // Images state
  uploadedImages: { file: File; preview: string }[];
  isDragOver: boolean;
  setIsDragOver: (val: boolean) => void;
  handleFileDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  // Description state
  newDescription: string;
  setNewDescription: (val: string) => void;
}

export const CreateListingForm: React.FC<CreateListingFormProps> = ({
  setIsFormOpen,
  handleFormSubmit,
  newTitle, setNewTitle, newCategory, setNewCategory, newCondition, setNewCondition,
  newPrice, setNewPrice, newReservePrice, setNewReservePrice, newDuration, setNewDuration, newSku, setNewSku,
  uploadedImages, isDragOver, setIsDragOver, handleFileDrop, handleFileInput, removeImage,
  newDescription, setNewDescription, onSaveDraft
}) => {
  return (
    <div className="flex-1 min-w-0 space-y-5">
        <BasicInformationSection
          newTitle={newTitle} setNewTitle={setNewTitle}
          newCategory={newCategory} setNewCategory={setNewCategory}
          newCondition={newCondition} setNewCondition={setNewCondition}
        />
        <PricingSection
          newPrice={newPrice} setNewPrice={setNewPrice}
          newReservePrice={newReservePrice} setNewReservePrice={setNewReservePrice}
          newDuration={newDuration} setNewDuration={setNewDuration}
          newSku={newSku} setNewSku={setNewSku}
        />
        <ImageUploadSection
          uploadedImages={uploadedImages}
          isDragOver={isDragOver} setIsDragOver={setIsDragOver}
          handleFileDrop={handleFileDrop}
          handleFileInput={handleFileInput}
          removeImage={removeImage}
        />
        <DescriptionSection
          newDescription={newDescription}
          setNewDescription={setNewDescription}
        />
        <FormActions setIsFormOpen={setIsFormOpen} onSaveDraft={onSaveDraft} />
    </div>
  );
};
