import ical from "node-ical";

// Grab secret vars from github repo
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const ICAL_URL = process.env.ICAL_URL;
const WINDOW_MINUTES = 5;

const main = async () => {
    // Grabs all calendar events from google calendar
    const events = await ical.async.fromURL(ICAL_URL);
    const now = new Date();

    for(const event of Object.values(events)){
        if(event.type !== "VEVENT") continue;
        const start = new Date(event.start);
        const minsUntil = (start - now) / 1000 / 60;
        console.log(minsUntil);
        const nyTime = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).format(now);
        const eventDate = start.toLocaleDateString("en-CA", {
            timeZone: "America/New_York"
        });
        const todayDate = now.toLocaleDateString("en-CA", {
            timeZone: "America/New_York"
        });
        if(event.summary.includes("Test Event")){
            console.log("EVENT:", event.summary);
            console.log("NY TIME:", nyTime);
            console.log("EVENT DATE:", eventDate);
            console.log("TODAY DATE:", todayDate);
            console.log("MINUTES UNTIL:", minsUntil);
            console.log("CONDITION:", 
                eventDate === todayDate &&
                nyTime >= "15:20" &&
                nyTime < "15:40" &&
                minsUntil > 0
            );
        }
        if(eventDate === todayDate && nyTime >= "15:20" && nyTime < "15:40" && minsUntil > 0){
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
                                 `**${event.summary}** happening TODAY at **${timeString}**!\n` +
                                 (event.location ? `**@ ${event.location}** 📍` : '')
                    })
                }
            );
        }
        if(minsUntil > 45 && minsUntil <= 63){
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
                                 (event.location ? `**@ ${event.location}** 📍` : '')
                    })
                }
            );
        }
    }
}
main().catch(console.error);
