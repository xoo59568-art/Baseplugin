const fs = require('fs');

module.exports = {
command: ['grupmenu'],
isGroup: false,
isOwner: false,

run: async (sock, m, { prefix }) => {
    try {
        await sock.sendMessage(m.chat, {
            react: {
                text: '⚡',
                key: m.key
            }
        });

        const pushname = m.pushName || "User";

        const teks = `

╭━━━━━━━━━━━━━━━━━━━━⬣
┃ 𓋜 -𝐑ᴀ፝֟፝֟ʙʙɪᴛ/>𝟑ن𓂃
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 USER INFORMATION 〕━━⬣
┃ 👤 Name   : ${pushname}
┃ 🤖 Bot    : Rabbit-MD
┃ 📂 Panel  : Group Menu
┃ ⚡ Status : Online
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 GROUP COMMANDS 〕━━⬣
┃ ⚡ ${prefix}kick <@tag/reply>
┃ ⚡ ${prefix}add <number>
┃ ⚡ ${prefix}promote <@tag>
┃ ⚡ ${prefix}demote <@tag>
┃ ⚡ ${prefix}group <open/close>
┃ ⚡ ${prefix}tagall <message>
┃ ⚡ ${prefix}hidetag <message>
┃ ⚡ ${prefix}editinfo <open/close>
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 REQUIREMENTS 〕━━⬣
┃ ✓ Bot must be Admin
┃ ✓ User must be Admin
┃ ✓ Available in Groups only
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 SYSTEM NOTICE 〕━━⬣
┃ • Use commands responsibly
┃ • Avoid command spamming
┃ • Respect group members
┃ • Follow group rules
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━━━━━━━━━━━━━━━━━━⬣
┃ Type ${prefix}menu
┃ to return to the Main Menu
╰━━━━━━━━━━━━━━━━━━━━⬣

«Powered By 𓋜 -𝐑ᴀ፝֟፝֟ʙʙɪᴛ/>𝟑ن𓂃
`;»

        await sock.sendMessage(
            m.chat,
            {
                image: {
                    url: "https://files.catbox.moe/i3dvoc.jpg"
                },
                caption: teks
            },
            {
                quoted: m
            }
        );

    } catch (err) {
        console.error("Group Menu Error:", err);
        m.reply("❌ Failed to load Group Menu.");
    }
}

};
