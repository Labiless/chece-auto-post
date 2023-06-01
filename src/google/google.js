import { google } from 'googleapis';
import docs from 'googleapis/build/src/apis/docs/index.js';
import path from 'path';

export default class Google {

    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    SHEET_ID = "1jmWiXb4q8AdBZwCq8gabIpiEykJolEakFrkGk7-aXR4";
    SA_FILENAME = "src/google/chece-388514-cd72aa13fc95.json";
    SA_PATH;

    constructor() {
        this.SA_PATH = path.join(process.cwd(), this.SA_FILENAME);
    }

    auth = async () => {
        return new docs.auth.GoogleAuth({
            keyFilename: this.SA_PATH,
            scopes: this.SCOPES
        });
    }

    readSheet = async () => {
        const authClient = await this.auth();
        const sheets = google.sheets({version: 'v4', auth: authClient});
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: this.SHEET_ID,
            range: "daily_track!A2:F2"
        });
        const rows = res.data.values;
        console.log(rows);
    }

}