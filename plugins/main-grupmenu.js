const fs = require('fs');

module.exports = {
    command: ['grupmenu'],  
    isGroup: false,        
    isOwner: false,

    run: async (sock, m, { prefix }) => {
        try {
            await sock.sendMessage(m.chat, { react: { text: '😹', key: m.key } });

            const pushname = m.pushName || "No Name";

            let teks = `
╭「 \`${pushname}\` 」

╭「 *ɢʀᴏᴜᴘ ᴍᴇɴᴜ* Codename: Vorthyx 」
│
│ ◧ ${prefix}kick <@tag/reply>
│ ◧ ${prefix}add <nomor>
│ ◧ ${prefix}promote <@tag>
│ ◧ ${prefix}demote <@tag>
│ ◧ ${prefix}group <open/close>
│ ◧ ${prefix}tagall <teks>
│ ◧ ${prefix}hidetag <teks>
│ ◧ ${prefix}editinfo <open/close>
│
╰───────────────☣︎

*Note:* Beberapa fitur di atas memerlukan status Admin bagi pengguna dan Bot!

Ketik *${prefix}menu* untuk kembali ke menu utama.
`;

            if (fs.existsSync("./menu.jpg")) {
                let imgGrup = fs.readFileSync("./menu.jpg");
                await sock.sendMessage(m.chat, {
                    image: imgGrup,
                    caption: teks
                }, { quoted: m });
            } else {
                await sock.sendMessage(m.chat, { text: teks }, { quoted: m });
            }

        } catch (err) {
            console.error("Error di plugin grupmenu:", err);
            m.reply("Terjadi kesalahan saat memuat Group Menu.");
        }
    }
};
