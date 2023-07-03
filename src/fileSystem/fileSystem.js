import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

export default class FileSystem{

    TEMP_FILE_FOLDER_NAME = "temp_file";
    TEMP_FILES_URL;

    constructor(){
        this.TEMP_FILES_URL = path.join(process.cwd(), this.TEMP_FILE_FOLDER_NAME);
    }

    saveTemplate = async (fileData, fileName) => {
        const filePath = `${this.TEMP_FILES_URL}/${fileName}`
        await fsExtra.outputFile(filePath, Buffer.from(fileData));
        console.log("image save in temp folder")
        return filePath;
    }

    cleanTempFolder = async () => {
        fsExtra.emptyDir(this.TEMP_FILES_URL)
    }

}