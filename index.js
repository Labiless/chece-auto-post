import Google from "./src/google/google.js"
import Spotify from "./src/spotify/spotify.js";
import Canvas from "./src/canvas/canvas.js";

const GoogleSerivce = new Google();
const SpotifyService = new Spotify();
const CanvasService = new Canvas();

(async () => {
    // await GoogleSerivce.auth();
    // await GoogleSerivce.readSheet();
    const templateImageUrl = await GoogleSerivce.getTemplateImageLocalPath();
    const spotifyImageUrl = await SpotifyService.getTrackImageCover("0N6cztxLjwLDb5Z0aHyezd");
    await CanvasService.createImgTag(templateImageUrl,spotifyImageUrl);
})()

