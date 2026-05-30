const axios = require("axios");

module.exports = {
command: ["play", "song"],

run: async (sock, m, { text }) => {
    try {
        if (!text) {
            return m.reply("🎵 Example: .play Faded");
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

        if (!data.result || !data.result.url) {
            return m.reply("❌ Song not found.");
        }

        await sock.sendMessage(m.chat, {
            react: {
                text: "⬇️",
                key: m.key
            }
        });

        // Download audio to buffer first
        const audio = await axios.get(data.result.url, {
            responseType: "arraybuffer",
            timeout: 120000
        });

        await sock.sendMessage(
            m.chat,
            {
                audio: Buffer.from(audio.data),
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `${data.result.title || "song"}.mp3`
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
        console.error("PLAY ERROR:", err);

        await sock.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });

        m.reply("❌ Song download failed.");
    }
}

};
