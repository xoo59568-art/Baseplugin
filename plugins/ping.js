module.exports = {
command: ["ping"],

run: async (sock, m) => {
    const start = Date.now();

    const msg = await sock.sendMessage(
        m.chat,
        { text: "🏓 Testing..." },
        { quoted: m }
    );

    const ping = Date.now() - start;

    await sock.sendMessage(
        m.chat,
        {
            text: `🏓 Pong!\n⚡ Speed: ${ping} ms`
        },
        { quoted: m }
    );
}

};
