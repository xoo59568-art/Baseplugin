 const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
    command: ['menu', 'help'], 
    isGroup: false,            
    isOwner: false,            

    run: async (sock, m, { prefix, isPremium, isOwner }) => {
        try {
            await sock.sendMessage(m.chat, { react: { text: '😹', key: m.key } });

            const pushname = m.pushName || "No Name";
            const wib = moment.tz('Asia/Jakarta').format('HH:mm:ss');
            const statusUser = isOwner ? 'Owner' : isPremium ? 'Premium' : 'User';

            let teks = `
╭「 \`${pushname}\` 」

╭「 *𓋜 -𝐑ᴀ፝֟፝֟ʙʙɪᴛ/>𝟑ن𓂃* 」
│
│◧ *ᴀᴜᴛʜᴏʀ:* 𓆩⃟𝐑𝛂͎᪱ʙʙᷱ᪳ɪ͓ʈ 𝐗ᴹᴅ˺⤹六⤸
│◧ *ʙᴏᴛɴᴀᴍᴇ:* 𓋜 -𝐑ᴀ፝֟፝֟ʙʙɪᴛ/>𝟑ن𓂃
│◧ *ᴠᴇʀꜱɪᴏɴ:* 0
│◧ *ᴛʏᴘᴇ:* Fuck!!
│◧ *ᴘʀᴇғɪx:* [ ${prefix} ]
│◧ *ᴛɪᴍᴇ:* ${wib} WIB
│◧ *ꜱᴛᴀᴛᴜꜱ:* ${statusUser}
╰───────────────☣︎


 ${prefix}grupmenu


who are you.
`;
            if (fs.existsSync("./menu.jpeg")) {
                let rvnz = fs.readFileSync("./menu.jpg");
                await sock.sendMessage(m.chat, {
                    image: rvnz,
                    caption: teks
                }, { quoted: m });
            } else {
                await sock.sendMessage(m.chat, { text: teks }, { quoted: m });
            }

            if (fs.existsSync("./menu.mp3")) {
                let rvnzaudio = fs.readFileSync("./menu.mp3");
                await sock.sendMessage(m.chat, {
                    audio: rvnzaudio,  
                    mimetype: "audio/mpeg",
                    ptt: true
                }, { quoted: m });
            }

        } catch (err) {
            console.error("Error di plugin menu kustom:", err);
            m.reply("Terjadi kesalahan saat memproses menu.");
        }
    }
};
