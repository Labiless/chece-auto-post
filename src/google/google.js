import { google } from 'googleapis';
import docs from 'googleapis/build/src/apis/docs/index.js';
import path from 'path';
import fs from 'fs';

export default class Google {

    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.scripts",
    "https://www.googleapis.com/auth/drive.metadata"
    ];
    SHEET_ID = "1jmWiXb4q8AdBZwCq8gabIpiEykJolEakFrkGk7-aXR4";
    SA_FILENAME = "src/google/chece-388514-cd72aa13fc95.json";
    DRIVE_FOLDER_ID = ["16YQkdyRGTtZoqSa5MVtoIx7rzvlPIEGR"];
    IMAGE_TEMPLATE_PREFIX = "template_stories";
    TEMP_FILE_FOLDER_NAME = "temp_file";
    TEMP_FILES_URL;
    SA_PATH;

    constructor() {
        this.SA_PATH = path.join(process.cwd(), this.SA_FILENAME);
        this.TEMP_FILES_URL = path.join(process.cwd(), this.TEMP_FILE_FOLDER_NAME);
    }

    auth = async () => {
        return new docs.auth.GoogleAuth({
            keyFilename: this.SA_PATH,
            scopes: this.SCOPES
        });
    }

    readSheet = async () => {
        const authClient = await this.auth();
        const sheets = google.sheets({ version: 'v4', auth: authClient });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: this.SHEET_ID,
            range: "daily_track!A2:F2"
        });
        const rows = res.data.values;
        console.log(rows);
    }

    getTemplateImageById = async () => {
        const authClient = await this.auth();
        const drive = google.drive({ version: 'v3', auth: authClient });
        const allTemplatesData = await drive.files.list({
            parents: this.DRIVE_FOLDER_ID,
            includeItemsFromAllDrives : true,
            supportsAllDrives : true,
        })
        .then(res => res.data.files.filter(el => el.name.includes(this.IMAGE_TEMPLATE_PREFIX)));
        const templateFile = await drive.files.get({
            fileId: allTemplatesData[0].id,
            alt: 'media',
        })

        let file = await fs.writeFile(`${this.TEMP_FILES_URL}/${"testfile.png"}`, templateFile.data,'binary', () => {console.log("done")})   
    }
}