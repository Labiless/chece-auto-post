import fetch from "node-fetch";

export default class Spotify {

    // account labiles
    CLIENT_ID = "8904648087004f0b977651f628e8a3bc";
    CLIENT_SECRET = "9f8e65b6ef134e27ba53fb2e61699d6a";
    TOKEN_URL = "https://accounts.spotify.com/api/token";
    TRACK_ENDPOINT = "https://api.spotify.com/v1/tracks/";

    PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/PLAYLIST_ID/tracks"
    PLAYLIST_ID = "5FmG1MP1UlyjltZfkR0NhX";

    // account radiochece
    CHECE_CLIENT_ID = "c9da1204de1b4b59be703e382eae0a10";
    CHECE_CLIENT_SERCRET = "aeaad01692884974a24f8191db583f46";
    AUTH_CODE = "AQBHvn3Zish1aenWpCAEEbkLleAPgcyQU5WCkg4jctfV68XbQPwLODChyyQiUnHFYNdGSHLk9c_4hh7BozY3Yp7rrkCwBOE9vGQ8_Te3BhiH8iNCSPnW2924VjkBsNUE-nDl0LeQaauBDOlco6R9N8Hkn9NfFnPePL_L6Gl6twDyi4-vq7wXU4qffgHyJD0B-O93pvy9xc83W6cgrqnotfPKfPmH2n584NtlnaW5ow";
    ACCESS_TOKEN = "BQA2qcISO2hXEbg3h0a5390R9Stchz0odBJvSlvZanR4vrZASRjOk21pWa_RZXgQvytQJ_g7xW9w8KeKoOsouElCV2wPg2vxOc4xBjoLlrsw7i4QrGbSQuCNaZTzBYnPu3mvA86T9AlpGEX4IeK9XZoJTe02lsBiD5BYKZ6pyQjIONMiAXArFAUQ0FNaMN3CkY658WlGn_MQ2X6K-8ia0WeJkNxw6mAIQDZX_Dc8n9gjuOUkm_kmhuIoolpdJRk8vOA";
    REFRESH_TOKEN = "AQCjujlufJzGp6inb2TNWDG2aelVo-J-FBH-n4bNr5u2Di5gtfEjrhaqHBhR_j2tGNcyjEF8Ns-0Aq_4E_Bx0z1ZnZAVTSOK_8x_ZElBvfANdQKcKyqKecclyIDLpyPhiKk";
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
        return url.split("/")[4].split("?")[0];
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
