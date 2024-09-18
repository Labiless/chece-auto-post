import fetch from "node-fetch";

export default class Spotify {

    // account labiles
    CLIENT_ID = "";
    CLIENT_SECRET = "";
    TOKEN_URL = "https://accounts.spotify.com/api/token";
    TRACK_ENDPOINT = "https://api.spotify.com/v1/tracks/";

    PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/PLAYLIST_ID/tracks"
    PLAYLIST_ID = "";

    // account radiochece
    CHECE_CLIENT_ID = "";
    CHECE_CLIENT_SERCRET = "";
    AUTH_CODE = "---";
    ACCESS_TOKEN = "-";
    REFRESH_TOKEN = "----";
    REFRESH_ENDPOINT = "https://accounts.spotify.com/api/token";

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

    calcBase64AuthHeader = (clientId, clientSecret) => new Buffer.from(clientId + ':' + clientSecret).toString('base64');

    getNewAccessToken = async (clientId, clientSecret) => {
        const body = `grant_type=refresh_token&refresh_token=${this.REFRESH_TOKEN}`;
        const response = await fetch(this.REFRESH_ENDPOINT, {
            method: "post",
            headers: {
                "Authorization": `Basic ${this.calcBase64AuthHeader(clientId, clientSecret)}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        });
        const data = await response.json();
        return data.access_token;
    }

    getIdFromUrl = (url) => {
        // https://open.spotify.com/track/2E0t7djrv8zrshK7hHjs9R?si=DETMqoYHQI2DS3OL4A3BDg
        try {
            return url.split("/")[4].split("?")[0];
        } catch (error) {
            return "";
        }
    }

    getTrackData = async (trackId) => {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`${this.TRACK_ENDPOINT}${trackId}`, {
            method: 'get',
            headers: {
                'Authorization': ` Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        return {
            artist: data.artists.map(el => el.name).join(", "),
            name: data.name,
            imageUrl: data.album.images[0].url,
            trackUrl: data.external_urls.spotify,
            previewUrl: data.preview_url
        }
    }

    getLastWeekTracks = async (tracksUrls) => {
        const newThis = this;
        const res = [];
        for(let i=0; i < tracksUrls.length; i++){
            const trackData = await this.getTrackData(newThis.getIdFromUrl(tracksUrls[i]));
            res.push(trackData);
        }
        return res;
    }

    getTrackImageCover = async (trackId) => {
        const trackData = await this.getTrackData(trackId);
        console.log("cover url from spotify ok");
        return trackData.album.images[1].url;
    }

    addTracksToPLaylist = async (tracks) => {
        const accessToken = await this.getNewAccessToken(this.CHECE_CLIENT_ID, this.CHECE_CLIENT_SERCRET);
        const tracksUri = tracks.map(el => `spotify:track:${this.getIdFromUrl(el)}`);
        const response = await fetch(this.PLAYLIST_ENDPOINT.replace("PLAYLIST_ID", this.PLAYLIST_ID), {
            method: "post",
            headers: {
                'Authorization': ` Bearer ${accessToken}`
            },
            body: JSON.stringify({
                uris: tracksUri,
                position: 0
            })
        });
        const data = await response.json();
        return data;
    }
}
