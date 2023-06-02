import Google from "./src/google/google.js"
import Spotify from "./src/spotify/spotify.js";

const GoogleSerivce = new Google();
const SpotifyService = new Spotify();

(async () => {
    // await GoogleSerivce.auth();
    // await GoogleSerivce.readSheet();
    await GoogleSerivce.getTemplateImageById();

    //https://open.spotify.com/track/0N6cztxLjwLDb5Z0aHyezd?si=8p0ZFjaqTASthswW9TQNnA
    //console.log(await SpotifyService.getTrackImageCover("0N6cztxLjwLDb5Z0aHyezd"));

})()

