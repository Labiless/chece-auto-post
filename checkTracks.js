//clean available tracks urls

import Spotify from "./src/spotify/spotify.js";
import Google from "./src/google/google.js";

const SpotifyService = new Spotify();
const GoogleSerivce = new Google();


(async () => {
    const dailyTracks = await GoogleSerivce.readSheet("daily_track!A2:D1000").then(data => data.map(el => SpotifyService.getIdFromUrl(el[0])));
    const availableTracks = await GoogleSerivce.readSheet("available_track!A2:A1000").then(data => data.map(el => el[0]));
    
    console.log("available tracks: ",availableTracks.length);
    const res = [];

    //check if we already used it
    for(let i = 0; i < dailyTracks.length; i++){
        const trackId = await SpotifyService.getIdFromUrl(availableTracks[i]);
        if(!dailyTracks.includes(trackId)) res.push(availableTracks[i]);
    }

    console.log("not used yet: ",res.length);

    //check if is good for spoty
    for(let i =0; i < res.length; i++){
        try {
            const trackData = await SpotifyService.getTrackData(SpotifyService.getIdFromUrl(res[i]));
            if(trackData.previewUrl != null){
                console.log("goodTrack: ", res[i]);
            }
        } catch (error) {
            
        }
    }

    
})();