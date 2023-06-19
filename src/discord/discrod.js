import Discord from "discord.js";
import { getDate } from '../utils.js';

export default class DiscordClient {

    TOKEN = "MTExODE0NjU4MTE4Nzc5MzAzNw.GMXAiQ.NvtIb32JbpHB3dR6gS8HWyX5atuOK-_kso-c8c";
    DAILY_TRACK_THREAD_ID = "1116093627026915458";
    client;

    constructor() {
        this.client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds
            ],
        });
    }

    sendDailyTrack = async (imageUrl, spotifyUrl) => {
        this.client.on("ready", async () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
            const channel = await this.client.channels.fetch(this.DAILY_TRACK_THREAD_ID);
            await channel.send(`${getDate()} - ${imageUrl} - ${spotifyUrl}`);
            this.closeConnection();
        })
        this.client.login(this.TOKEN);
    }

    closeConnection = () => {
        this.client.destroy();
        console.log("close discord connection");
    }
}