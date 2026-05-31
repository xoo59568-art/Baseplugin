const { sendButtons } = require("gifted-btns");

module.exports = {
command: ["pg"],

run: async (sock, m) => {
const start = Date.now();

const ping = Date.now() - start;

await sendButtons(sock, m.chat, {
    title: "🏓 Pong!",
    text: `⚡ Speed: ${ping} ms`,
    footer: "Rabbit Bot",
    buttons: [
        {
            id: ".ping",
            text: "🔄 Refresh Ping"
        },
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "🌐 Rabbit API",
                url: "https://rabbitapi.zone.id"
            })
        }
    ]
});

}
};
