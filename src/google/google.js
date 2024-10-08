import { google } from 'googleapis';
import docs from 'googleapis/build/src/apis/docs/index.js';
import path from 'path';
import fs from 'fs';
import { getDate } from '../utils.js';

export default class Google {

    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.appdata",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/drive.photos.readonly",
        "https://www.googleapis.com/auth/drive.readonly"
    ];
    SHEET_ID = "1jmWiXb4q8AdBZwCq8gabIpiEykJolEakFrkGk7-aXR4";
    SA_FILENAME = "src/google/chece-388514-cd72aa13fc95.json";
    DRIVE_FOLDER_ID = ["16YQkdyRGTtZoqSa5MVtoIx7rzvlPIEGR"];
    IMAGE_TEMPLATE_PREFIX = "template_stories";
    SA_PATH;
    DAILY_TRACKS_RANGE = "daily_track!A2:D1000";

    constructor() {
        this.SA_PATH = path.join(process.cwd(), this.SA_FILENAME);
    }

    auth = async () => {
        return new docs.auth.GoogleAuth({
            keyFilename: this.SA_PATH,
            scopes: this.SCOPES
        });
    }
    compareDate = (d1,d2) => {
        return d1 === d2;
    }

    readSheet = async (range) => {
        const authClient = await this.auth();
        const sheets = google.sheets({ version: 'v4', auth: authClient });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: this.SHEET_ID,
            range: range
        });
        return res.data.values;
    }

    getDailyTrack = async () => {
        const allRows = await this.readSheet(this.DAILY_TRACKS_RANGE);
        return allRows.filter(el => this.compareDate(getDate(), el[1]))[0];
    }

    getLastWeekDailyTracks = async () => {
        const allRows = await this.readSheet(this.DAILY_TRACKS_RANGE);
        const todayIndex = allRows.map(el => el[1]).indexOf(getDate());
        const res = [];
        const startIndex = todayIndex - 7;
        for(let i = startIndex; i < todayIndex; i++){
            res.push(allRows[i][0])
        }
        return res;
    }

    downloadImageTemplate = async (folderId, imagePrefix, templateId) => {
        const authClient = await this.auth();
        const drive = google.drive({ version: 'v3', auth: authClient });
        const allTemplatesData = await drive.files.list({
            parents: folderId,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
        })
        .then(res => res.data.files.filter(el => el.name.includes(`${imagePrefix}_${templateId}`)));

        const templateFile = await drive.files.get({
            fileId: allTemplatesData[0].id,
            alt: 'media',
        }, {
            responseType: 'arraybuffer',
        })
        return templateFile.data;
    }
}