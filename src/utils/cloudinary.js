import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dir1c4dlx', 
  api_key: '296636728869616', 
  api_secret: 'QGO9shEp-ZXg2olaTV6OkZkNMW8' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        return response
    } catch (error) {
        return {message: error}
    }
}

export {uploadOnCloudinary} 