const axios = require("axios");

module.exports = {
    command: ["ttswgc"],
    isGroup: true,
    isOwner: false,

    run: async (sock, m, { text, prefix, command }) => {
        try {

            if (!text) {
                return m.reply(
                    `Contoh:\n${prefix + command} https://vt.tiktok.com/xxxxx | caption bebas`
                );
            }
            
            let [url, cap] = text.split("|").map(v => v.trim());

            if (!url) return m.reply("Link nya mana bang 😅");

       
            await sock.sendMessage(m.chat, {
                react: {
                    text: "⏳",
                    key: m.key
                }
            });
            const res = await axios.get(
                `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
            );

            const result = res.data?.data;

            if (!result) {
                return m.reply("Gagal mengambil data TikTok!");
            }
            const finalVideo = result.hdplay || result.play;

            if (finalVideo) {

                const video = await axios.get(finalVideo, {
                    responseType: "arraybuffer"
                });

                let msg = {
                    video: video.data,
                    mimetype: "video/mp4"
                };

                if (cap) msg.caption = cap;

                await sock.sendMessage(m.chat, {
                    groupStatusMessage: msg
                });

            }
            else if (result.images && result.images.length > 0) {

                for (let img of result.images) {

                    const image = await axios.get(img, {
                        responseType: "arraybuffer"
                    });

                    let msg = {
                        image: image.data
                    };

                    if (cap) msg.caption = cap;

                    await sock.sendMessage(m.chat, {
                        groupStatusMessage: msg
                    });

                    await new Promise(resolve => setTimeout(resolve, 700));
                }
            }

            await sock.sendMessage(m.chat, {
                react: {
                    text: "✅",
                    key: m.key
                }
            });

        } catch (err) {
            console.error("TTSWGC ERROR:", err);

            await sock.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });

            m.reply("Error bang 😵");
        }
    }
};