export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  error?: {
    message: string;
  };
}

export const getCloudinaryConfig = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
  const isConfigured = Boolean(
    cloudName &&
    uploadPreset &&
    cloudName !== 'your-cloud-name' &&
    uploadPreset !== 'your-unsigned-upload-preset'
  );

  return { cloudName, uploadPreset, isConfigured };
};

/**
 * Uploads a file directly to Cloudinary using unsigned upload preset.
 */
export async function uploadToCloudinary(
  file: File,
  options?: { folder?: string; onProgress?: (percent: number) => void }
): Promise<string> {
  const { cloudName, uploadPreset, isConfigured } = getCloudinaryConfig();

  if (!isConfigured) {
    throw new Error(
      'Cloudinary is not configured. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.'
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (options?.folder) {
    formData.append('folder', options.folder);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (xhr.upload && options?.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress?.(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData?.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload.'));
    xhr.send(formData);
  });
}
