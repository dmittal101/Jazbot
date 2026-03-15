import ical from "node-ical";

// Grab secret vars from github repo
const WEBHOOK_URL = new process.env.DISCORD_WEBHOOK_URL;
const ICAL_URL = new process.env.ICAL_URL;
const WINDOW_MINUTES = 20;

const main = async () => {
    // Grabs all calendar events from google calendar
    const events = await ical.async.fromUrl(ICAL_URL);
    const now = new Date();

    for(const event of Object.values(events)){
        if(event.type !== "VEVENT") continue;
        const start = new Date(event.start);
        const timeUntil = (start - now) / 1000 / 60;

        if(minsUntil >= 55 && minsUntil <= 55 + WINDOW_MINUTES){
            const timeString = start.toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

            await fetch(WEBHOOK_URL,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        content: `🕺 **Dance Practice Reminder!**\n` +
                                 `**${event.summary}** starts in about 1 hour at **${timeString}**!\n` +
                                 (event.location ? `📍 ${event.location}` : '')
                    })
                }
            );
        }
    }
}
main().catch(console.error);