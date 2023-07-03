import Google from "./src/google/google.js"
import Spotify from "./src/spotify/spotify.js";
import Canvas from "./src/canvas/canvas.js";
import Cloudionary from "./src/cloudionary/cloudionary.js";
import FileSystem from "./src/fileSystem/fileSystem.js";
import DiscordClient from "./src/discord/discrod.js";
import VideoMaker from "./src/videoMaker/videoMaker.js";
import path from 'path';

const GoogleSerivce = new Google();
const SpotifyService = new Spotify();
const CanvasService = new Canvas();
const CloudionaryService = new Cloudionary();
const FileSystemService = new FileSystem();
const DiscordService = new DiscordClient();
const VideoMakerService = new VideoMaker();

const DRIVE_FOLDER_ID = ["16YQkdyRGTtZoqSa5MVtoIx7rzvlPIEGR"];
const IMAGE_TEMPLATE_PREFIX = "template_stories";

(async () => {
    // get daily track from google sheet
    await GoogleSerivce.auth();
    const dailyTrack = await GoogleSerivce.getDailyTrack();
    // get tempalte from drive
    const tempalteId = dailyTrack[2];
    const templateImageData = await GoogleSerivce.downloadImageTemplate(DRIVE_FOLDER_ID,IMAGE_TEMPLATE_PREFIX,tempalteId);
    const templateImageUrl = await FileSystemService.saveTemplate(templateImageData, "template.png");
    // get data from spotyfy
    const spotifyUrl = dailyTrack[0];
    const spotifyId = SpotifyService.getIdFromUrl(spotifyUrl);
    const spotifyTrackData = await SpotifyService.getTrackData(spotifyId);
    const spotifyImageUrl = spotifyTrackData.imageUrl;
    // create image
    const imageBase64 = await CanvasService.createImg(templateImageUrl, spotifyImageUrl, spotifyTrackData.name, spotifyTrackData.artist);
    const imagePublicUrl = await CloudionaryService.uploadImage(imageBase64, spotifyTrackData.name.replaceAll(" ", "_"), "image");
    // create video
    VideoMakerService.createVideo(imagePublicUrl, spotifyTrackData.previewUrl, `temp_file/${spotifyTrackData.name.replaceAll(" ", "_")}.mp4`, async () => {
        // upload image to cloudionary
        const videoPublicUrl = await CloudionaryService.uploadImage(path.join(process.cwd(),`temp_file/${spotifyTrackData.name.replaceAll(" ", "_")}.mp4`), spotifyTrackData.name.replaceAll(" ", "_"),"video");
        // discord
        await DiscordService.sendDailyTrack(videoPublicUrl, spotifyUrl);
        // clear temp folder
        FileSystemService.cleanTempFolder();
        return true
    });
})()

