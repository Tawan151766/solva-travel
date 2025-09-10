import { v2 as cloudinary } from 'cloudinary';

class CloudinaryService {
  constructor() {
    // Configure Cloudinary when instance is created
    this.configure();
  }

  configure() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true, // Use HTTPS
    });

    // Debug configuration
    console.log('🔧 Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***configured***' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'missing'
    });
  }
  async uploadFile(filePath, options = {}) {
    try {
      // Extract filename from path
      const fileName = filePath.split(/[\\\/]/).pop();
      
      const uploadOptions = {
        resource_type: 'auto', // Automatically detect file type
        public_id: `solva-travel/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        folder: 'solva-travel',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' }, // Limit max size
          { quality: 'auto:good' }, // Auto optimize quality
          { format: 'auto' } // Auto format (WebP for modern browsers)
        ],
        ...options
      };

      // Upload from file path directly
      const result = await cloudinary.uploader.upload(filePath, uploadOptions);
      
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  // Alternative method for buffer uploads (for API routes)
  async uploadBuffer(buffer, fileName, options = {}) {
    try {
      const uploadOptions = {
        resource_type: 'auto',
        public_id: `solva-travel/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        folder: 'solva-travel',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'auto' }
        ],
        ...options
      };

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('File uploaded to Cloudinary:', result.public_id);
              resolve({
                id: result.public_id,
                name: fileName,
                url: result.secure_url,
                publicUrl: result.secure_url,
                size: result.bytes,
                type: result.format,
                width: result.width,
                height: result.height,
                cloudinaryId: result.public_id,
                resourceType: result.resource_type
              });
            }
          }
        );

        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error('Cloudinary service error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('File deleted from Cloudinary:', publicId, result);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async listFiles(folder = 'solva-travel', maxResults = 30) {
    try {
      const result = await cloudinary.search
        .expression(`folder:${folder}`)
        .sort_by([['created_at', 'desc']])
        .max_results(maxResults)
        .execute();

      return result.resources.map(resource => ({
        id: resource.public_id,
        name: resource.public_id.split('/').pop(),
        url: resource.secure_url,
        size: resource.bytes,
        type: resource.format,
        width: resource.width,
        height: resource.height,
        createdAt: resource.created_at,
        cloudinaryId: resource.public_id
      }));
    } catch (error) {
      console.error('Cloudinary list error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async getOptimizedUrl(publicId, options = {}) {
    try {
      const defaultOptions = {
        quality: 'auto:good',
        format: 'auto',
        crop: 'limit'
      };

      const optimizedUrl = cloudinary.url(publicId, {
        ...defaultOptions,
        ...options
      });

      return optimizedUrl;
    } catch (error) {
      console.error('Cloudinary URL generation error:', error);
      throw new Error(`Failed to generate optimized URL: ${error.message}`);
    }
  }

  // Generate different image sizes
  async getImageVariants(publicId) {
    try {
      const variants = {
        thumbnail: cloudinary.url(publicId, {
          width: 300,
          height: 200,
          crop: 'fill',
          quality: 'auto:good',
          format: 'auto'
        }),
        medium: cloudinary.url(publicId, {
          width: 800,
          height: 600,
          crop: 'limit',
          quality: 'auto:good',
          format: 'auto'
        }),
        large: cloudinary.url(publicId, {
          width: 1920,
          height: 1080,
          crop: 'limit',
          quality: 'auto:good',
          format: 'auto'
        }),
        original: cloudinary.url(publicId, {
          quality: 'auto:good',
          format: 'auto'
        })
      };

      return variants;
    } catch (error) {
      console.error('Cloudinary variants error:', error);
      throw new Error(`Failed to generate image variants: ${error.message}`);
    }
  }
}

export default CloudinaryService;
