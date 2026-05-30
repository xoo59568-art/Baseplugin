const axios = require("axios");

module.exports = {
command: ["song", "play"],

run: async (sock, m, { text }) => {
    try {
        if (!text) {
            return m.reply("🎵 Example: .song Faded");
        }

        await sock.sendMessage(m.chat, {
            react: {
                text: "🔍",
                key: m.key
            }
        });

        const { data } = await axios.get(
            `https://rabbitapi.nett.to/api/song?url=${encodeURIComponent(text)}`
        );

        if (!data.status && !data.result) {
            return m.reply("❌ Song not found.");
        }

        await sock.sendMessage(m.chat, {
            react: {
                text: "⬇️",
                key: m.key
            }
        });

        await sock.sendMessage(
            m.chat,
            {
                audio: {
                    url: data.result.url
                },
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `${data.result.title}.mp3`
            },
            {
                quoted: m
            }
        );

        await sock.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (err) {
        console.error(err);

        await sock.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });

        m.reply("⚠️ Song download failed.");
    }
}

};
