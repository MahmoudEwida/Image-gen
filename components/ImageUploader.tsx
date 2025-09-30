
import React, { useRef } from 'react';
import { Icon } from './icons';

interface ImageUploaderProps {
  id: string;
  title: string;
  image: File | null;
  onImageChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, image, onImageChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageUrl = image ? URL.createObjectURL(image) : null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onImageChange(file || null);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (inputRef.current) {
        inputRef.current.value = '';
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">{title}</h3>
      <div 
        onClick={handleContainerClick}
        className="relative group w-full aspect-square bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 hover:border-indigo-500 transition-colors duration-300 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Remove image"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <Icon name="upload" className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold">Click to upload</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
