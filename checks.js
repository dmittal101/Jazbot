import ical from "node-ical";

const WEBHOOK_URL = new process.env.DISCORD_WEBHOOK_URL;
const ICAL_URL = new process.env.ICAL_URL;
const WINDOW_MINUTES = 20;

const main = async () => {
    const events = await ical.async.fromUrl(ICAL_URL);
    const now = new Date();
    
}