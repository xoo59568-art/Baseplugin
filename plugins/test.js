const { sendButtons } = require("gifted-btns");

module.exports = {
command: ["btntest"],

run: async (sock, m) => {

await sendButtons(sock, m.chat, {
    title: "🤖 Button Test",
    text: "Quick Reply Button Test",
    footer: "Rabbit Bot",
    buttons: [
        {
            id: ".ping",
            text: "🏓 Ping"
        },
        {
            id: ".menu",
            text: "📋 Menu"
        }
    ]
});

}
};
