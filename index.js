import Google from "./src/google/google.js"
import Spotify from "./src/spotify/spotify.js";
import Canvas from "./src/canvas/canvas.js";
import Cloudionary from "./src/cloudionary/cloudionary.js";
import FileSystem from "./src/fileSystem/fileSystem.js";
import DiscordClient from "./src/discord/discrod.js";

const GoogleSerivce = new Google();
const SpotifyService = new Spotify();
const CanvasService = new Canvas();
const CloudionaryService = new Cloudionary();
const FileSystemService = new FileSystem();
const DiscordService = new DiscordClient();

(async () => {
    // get daily track from google sheet
    await GoogleSerivce.auth();
    const dailyTrack = await GoogleSerivce.getDailyTrack();
    // get tempalte from drive
    const tempalteId = dailyTrack[2];
    const templateImageData = await GoogleSerivce.downloadImageTemplate(tempalteId);
    const templateImageUrl = await FileSystemService.saveTemplate(templateImageData);
    // get data from spotyfy
    const spotifyUrl = dailyTrack[0];
    const spotifyId = SpotifyService.getIdFromUrl(spotifyUrl);
    const spotifyTrackData = await SpotifyService.getTrackData(spotifyId);
    const spotifyImageUrl = spotifyTrackData.imageUrl;
    // create image
    const imageBase64 = await CanvasService.createImg(templateImageUrl, spotifyImageUrl,spotifyTrackData.name, spotifyTrackData.artist);
    // upload image to cloudionary
    const imagePublicUrl = await CloudionaryService.uploadImage(imageBase64, spotifyTrackData.name.replaceAll(" ", "_"));
    // clear temp folder
    FileSystemService.cleanTempFolder();
    // discord
    await DiscordService.sendDailyTrack(imagePublicUrl, spotifyUrl);
})()

