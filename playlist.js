import Spotify from "./src/spotify/spotify.js";
import Google from "./src/google/google.js"
import FileSystem from "./src/fileSystem/fileSystem.js";
import CanvasPlaylist from "./src/canvas/canvasPlaylist.js";
import Cloudionary from "./src/cloudionary/cloudionary.js";
import DiscordClient from "./src/discord/discrod.js";

const SpotifyService = new Spotify();
const GoogleSerivce = new Google();
const FileSystemService = new FileSystem();
const CanvasService = new CanvasPlaylist();
const CloudionaryService = new Cloudionary();
const DiscordService = new DiscordClient();

const DRIVE_PLAYLIST_FOLDER_ID = ["1O_ifOd7vZzUtr0ziW8QBXzNOD9SDQ_Zi"];
const IMAGE_TEMPLATE_PREFIX = "template_post_playlist";

(async () => {
    const trackToAdd = await GoogleSerivce.getLastWeekDailyTracks();
/*     const tracksData = await SpotifyService.getLastWeekTracks(trackToAdd); */

    SpotifyService.addTracksToPLaylist(trackToAdd);

/*     const templateImageData1 = await GoogleSerivce.downloadImageTemplate(DRIVE_PLAYLIST_FOLDER_ID,IMAGE_TEMPLATE_PREFIX,1);
    const templateImageData2 = await GoogleSerivce.downloadImageTemplate(DRIVE_PLAYLIST_FOLDER_ID,IMAGE_TEMPLATE_PREFIX,2);

    const templateImageUrl1 = await FileSystemService.saveTemplate(templateImageData1, "template_post_playlist_1.jpg");
    const templateImageUrl2 = await FileSystemService.saveTemplate(templateImageData2, "template_post_playlist_2.jpg");

    const image1Base64 = await CanvasService.createCoverImage(templateImageUrl1, 2);
    const image2Base64 = await CanvasService.createTracksListImage(templateImageUrl2, tracksData);

    const image1PublicUrl = await CloudionaryService.uploadImage(image1Base64, "playlist", "image");
    const image2PublicUrl = await CloudionaryService.uploadImage(image2Base64, "traks", "image");

    // discord
    await DiscordService.sendPlaylist(image1PublicUrl, image2PublicUrl, "https://www.radiochece.it/playlist");
 */
    // clear temp folder
    //FileSystemService.cleanTempFolder();

})();