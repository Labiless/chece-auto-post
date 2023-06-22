import fetch from "node-fetch";

export default class Spotify {

    CLIENT_ID = "8904648087004f0b977651f628e8a3bc";
    CLIENT_SECRET = "9f8e65b6ef134e27ba53fb2e61699d6a";
    TOKEN_URL = "https://accounts.spotify.com/api/token";
    TRACK_ENDPOINT = "https://api.spotify.com/v1/tracks/";

    PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/PLAYLIST_ID/tracks"
    PLAYLIST_ID = "4inbRe01L3JyZLE1cCEag8";

    AUTH_CODE = "AQDu3WKEh2UxY-RC3Jwv5FpzYDS9XT_3AvE082O1KaUJKnWVoIx4E_dv4Ugp5Htw5vqwNLDa_eUo_TUxA7IzF6ErpGIxyydNDdsT84rLSs3X5YTKFQB6HmNQ5iSfrvIJ2uDtCY354wZl4rLgZez08wTNjk2GPk1VdT8OoJMt-uo5VT1R2cQb5jit6yGZ7o60a8WR-db3WUFwdCe9DckiAlMdD3m7FTSXaKu8wZxVbA"
    REFRESH_TOKEN = "AQDdtuHLt7dXr1G66q8mxjBbTYesaDBJc2r4tNhDx5NTmRpmMVUHk6FoCKPcP5qx-JTRUHfFDoa1sgolVMyS2QzAiVzk5MkdRibdAeY-tKb-rdUasnMFvhj89s71g4-45Ig";
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

    calcBase64AuthHeader = () => new Buffer.from(this.CLIENT_ID + ':' + this.CLIENT_SECRET).toString('base64');

    getNewAccessToken = async() => {
        const body = `grant_type=refresh_token&refresh_token=${this.REFRESH_TOKEN}`;
        const response = await fetch(this.REFRESH_ENDPOINT, {
            method: "post",
            headers : {
                "Authorization" : `Basic ${this.calcBase64AuthHeader()}`,
                "Content-Type" : "application/x-www-form-urlencoded"
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
        const response = await fetch(`${this.TRACK_ENDPOINT}${trackId}`,{
            method: 'get',
            headers: {
                'Authorization' : ` Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        return {
            artist : data.artists.map(el => el.name).join(", "),
            name :  data.name, 
            imageUrl : data.album.images[0].url,
            trackUrl : data.external_urls.spotify,
            previewUrl : data.preview_url
        }
    }

    getTrackImageCover = async (trackId) => {
        const trackData = await this.getTrackData(trackId);
        console.log("cover url from spotify ok");
        return trackData.album.images[1].url;
    }

    addTracksToPLaylist = async(tracks) => {
        const accessToken = await this.getNewAccessToken();
        const response = await fetch(this.PLAYLIST_ENDPOINT.replace("PLAYLIST_ID", this.PLAYLIST_ID), {
            method: "post",
            headers: {
                'Authorization' : ` Bearer ${accessToken}`
            },
            body: JSON.stringify({
                uris: tracks,
                position: 0
            })
        });
        const data = await response.json();  
        return data;
    }
}
