import fetch from "node-fetch";

export default class Spotify {

    CLIENT_ID = "8904648087004f0b977651f628e8a3bc";
    CLIENT_SECRET = "9f8e65b6ef134e27ba53fb2e61699d6a";
    TOKEN_URL = "https://accounts.spotify.com/api/token";
    TRACK_ENDPOINT = "https://api.spotify.com/v1/tracks/";

    constructor() {

    }

    getAccessToken = async () => {
        const body = `grant_type=client_credentials&client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}`;
        const response = await fetch(this.TOKEN_URL,
            {
                method: 'post',
                body,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
        const data = await response.json();
        return data.access_token;    
    }

    getTrackData = async (trackId) => {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`${this.TRACK_ENDPOINT}${trackId}`,{
            method: 'get',
            headers: {
                'Authorization' : ` Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        return data;
    }


    getTrackImageCover = async (trackId) => {
        const trackData = await this.getTrackData(trackId)
        return trackData.album.images[1].url;
    }
}