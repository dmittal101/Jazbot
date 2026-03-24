import ical from "node-ical";

// Grab secret vars from github repo
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const ICAL_URL = process.env.ICAL_URL;
const WINDOW_MINUTES = 20;

const main = async () => {
    // Grabs all calendar events from google calendar
    const events = await ical.async.fromURL(ICAL_URL);
    const now = new Date();

    for(const event of Object.values(events)){
        if(event.type !== "VEVENT") continue;
        const start = new Date(event.start);
        const minsUntil = (start - now) / 1000 / 60;
        console.log(minsUntil);

        if(minsUntil >= 50 && minsUntil <= 50 + WINDOW_MINUTES){
            const timeString = start.toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/New_York"
                }
            );

            let title = "";
            if(event.summary.toLowerCase().includes("ebm") || event.summary.toLowerCase().includes("eboard") || event.summary.toLowerCase().includes("e-board")){
                title = "**Reminder for all E-Board Members! <@&1418402594505756786>**\n"
            }
            else{
                title = "🕺 **Reminder for all Members! @everyone**\n"
            }
            await fetch(WEBHOOK_URL,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        content: title +
                                 `**${event.summary}** starts in about 1 hour at **${timeString}**!\n` +
                                 (event.location ? `@ **${event.location}** 📍` : '')
                    })
                }
            );
        }
    }
}
main().catch(console.error);
