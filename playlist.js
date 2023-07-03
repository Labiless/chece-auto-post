import Spotify from "./src/spotify/spotify.js";
import Google from "./src/google/google.js"
import FileSystem from "./src/fileSystem/fileSystem.js";

const SpotifyService = new Spotify();
const GoogleSerivce = new Google();
const FileSystemService = new FileSystem();

const DRIVE_PLAYLIST_FOLDER_ID = ["1O_ifOd7vZzUtr0ziW8QBXzNOD9SDQ_Zi"];
const IMAGE_TEMPLATE_PREFIX = "template_post_playlist";

(async () => {
    // const trackToAdd = await GoogleSerivce.getLastWeekDailyTracks();
    // SpotifyService.addTracksToPLaylist(trackToAdd);

    const templateImageData1 = await GoogleSerivce.downloadImageTemplate(DRIVE_PLAYLIST_FOLDER_ID,IMAGE_TEMPLATE_PREFIX,1);
    const templateImageData2 = await GoogleSerivce.downloadImageTemplate(DRIVE_PLAYLIST_FOLDER_ID,IMAGE_TEMPLATE_PREFIX,2);

    const templateImageUrl1 = await FileSystemService.saveTemplate(templateImageData1, "template_post_playlist_1.jpg");
    const templateImageUrl2 = await FileSystemService.saveTemplate(templateImageData2, "template_post_playlist_2.jpg");

})();