import { Platform } from 'react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const CLOUDINARY_CLOUD_NAME = 'your-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = 'your-upload-preset';

const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME
  }
});

export const uploadToCloudinary = async (uri: string): Promise<string> => {
  try {
    if (!uri) {
      throw new Error('Invalid image URI: URI is empty');
    }

    const formData = new FormData();
    const fileData = {
      uri: Platform.OS === 'android' ? `file://${uri}` : uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    };

    console.log('Preparing file data:', fileData);

    formData.append('file', fileData as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    console.log('Cloudinary response:', data);

    if (!response.ok) {
      console.error('Cloudinary error details:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw new Error(data.error?.message || data.message || 'Upload failed');
    }

    if (!data.public_id) {
      throw new Error('No public_id received from Cloudinary');
    }

    const optimizedImage = cld
      .image(data.public_id)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()).width(800).height(600));

    const finalUrl = optimizedImage.toURL();
    console.log('Successfully generated optimized URL:', finalUrl);

    return finalUrl;
  } catch (error) {
    console.error('Detailed upload error:', error);
    throw error;
  }
};
