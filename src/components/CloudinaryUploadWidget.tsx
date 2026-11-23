import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { uploadToCloudinary, getCloudinaryConfig } from '../lib/cloudinary';

interface CloudinaryUploadWidgetProps {
  label?: string;
  folder?: string;
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  className?: string;
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  label = 'Upload Image',
  folder = 'streets-of-tripura',
  currentUrl,
  onUploadSuccess,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { isConfigured } = getCloudinaryConfig();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isConfigured) {
      setError('Image upload service is not active. Please ensure storage keys are present in .env.');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      const uploadedUrl = await uploadToCloudinary(file, {
        folder,
        onProgress: (p) => setProgress(p)
      });

      onUploadSuccess(uploadedUrl);
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#475569]">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Preview & Upload Dropzone Button */}
      {currentUrl ? (
        <div className="relative rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-2.5 flex items-center gap-3">
          <img
            src={currentUrl}
            alt="Uploaded preview"
            className="w-16 h-14 object-cover rounded-lg border border-[#e2e8f0] bg-white shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#0f172a] truncate">Image uploaded</p>
            <p className="text-[10px] text-[#94a3b8]">Ready to publish</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f1f5f9] text-[11px] font-semibold text-[#475569] transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => onUploadSuccess('')}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            if (!isUploading) fileInputRef.current?.click();
          }}
          className={`border-2 border-dashed border-[#cbd5e1] hover:border-[#4f46e5] bg-[#f8fafc] hover:bg-indigo-50/30 rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
            isUploading ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-white border border-[#e2e8f0] text-[#4f46e5] flex items-center justify-center shadow-2xs">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#4f46e5]" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0f172a]">
                {isUploading ? `Uploading image (${progress}%)...` : 'Click to upload image'}
              </p>
              <p className="text-[11px] text-[#94a3b8]">
                Supports JPEG, PNG, WebP up to 15MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#4f46e5] h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <p className="text-[11px] text-rose-600 flex items-center gap-1.5 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};