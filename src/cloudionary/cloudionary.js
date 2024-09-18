import * as cloudinary from 'cloudinary'

export default class Cloudionary {

    API_KEY = "";
    API_SECRET = "";
    CLOUD_NAME = "";

    constructor() {

        cloudinary.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.API_KEY,
            api_secret: this.API_SECRET
        });

    }

    uploadImage = async (image64, publicId, type) => {
        try {
            const res = await cloudinary.v2.uploader.upload(image64, { public_id: publicId, resource_type: type });
            console.log("impage uploaded to cloudionary " + res.secure_url);
            return res.secure_url;
        } catch (error) {
           console.log(error);
           return false;
        }
    }

}