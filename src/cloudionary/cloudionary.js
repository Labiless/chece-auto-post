import * as cloudinary from 'cloudinary'

export default class Cloudionary {

    API_KEY = "535236151691195";
    API_SECRET = "TH68TQlAn37R76vw5CEGB7golWg";
    CLOUD_NAME = "dmwtnrrrj";

    constructor() {

        cloudinary.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.API_KEY,
            api_secret: this.API_SECRET
        });

    }

    uploadImage = async (image64, publicId) => {
        try {
            const res = await cloudinary.uploader.upload(image64, { public_id: publicId });
            console.log("impage uploaded to cloudionary " + res.secure_url);
            return res.secure_url;
        } catch (error) {
           console.log(error);
           return false;
        }
    }

}