import React, { useState, useRef } from 'react';
import { Button, Card, CardBody } from '@nextui-org/react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../services/apiService';

interface ImageUploadProps {
  onUploadSuccess: (imageData: {
    url: string;
    filename: string;
    size: number;
    contentType: string;
  }) => void;
  initialImageUrl?: string;
  onRemove?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  initialImageUrl,
  onRemove,
}) => {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPG, PNG, GIF, WebP');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploading(true);
      const response = await apiService.uploadCoverImage(file);
      onUploadSuccess({
        url: response.url,
        filename: response.filename,
        size: parseInt(response.size),
        contentType: response.contentType,
      });
      setError(null);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <Card>
          <CardBody className="p-0 relative">
            <img
              src={preview}
              alt="Cover preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              isIconOnly
              color="danger"
              variant="flat"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X size={16} />
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card
          isPressable
          onPress={handleClick}
          className="border-2 border-dashed border-default-300 bg-default-50 hover:bg-default-100"
        >
          <CardBody className="flex flex-col items-center justify-center py-12 space-y-2">
            <ImageIcon size={48} className="text-default-400" />
            <p className="text-default-600">Click to upload cover image</p>
            <p className="text-xs text-default-400">JPG, PNG, GIF, WebP (Max 5MB)</p>
            <Button
              color="primary"
              variant="flat"
              startContent={<Upload size={16} />}
              isLoading={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </Button>
          </CardBody>
        </Card>
      )}

      {error && (
        <p className="text-danger text-sm">{error}</p>
      )}
    </div>
  );
};
