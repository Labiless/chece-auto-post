import Spotify from "./src/spotify/spotify.js";

const SpotifyService = new Spotify();

(async () => {
    console.log(await SpotifyService.addTracksToPLaylist(["spotify:track:5no7a6A49oaGEzcq9icWJP"]))
})();