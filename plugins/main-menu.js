const { generateWAMessageContent, generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
    command: ['menu', 'help'], 
    isGroup: false,            
    isOwner: false,            

    run: async (sock, m, { prefix, isPremium, isOwner }) => {
        try {
 
            await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

 
            const pushname = m.pushName || "No Name";
            const wib = moment.tz('Asia/Jakarta').format('HH:mm:ss');
            const statusUser = isOwner ? 'Owner' : isPremium ? 'Premium' : 'User';

            
            const rvnz = fs.existsSync("./menu.jpg") ? fs.readFileSync("./menu.jpg") : Buffer.alloc(0);
            const rvnzaudio = fs.existsSync("./menu.mp3") ? fs.readFileSync("./menu.mp3") : Buffer.alloc(0);

            let teks = `
╭「 \`${pushname}\` 」

╭「 *ᐯㄖ尺₮卄ㄚ乂* 」
│
│◧ *ᴀᴜᴛʜᴏʀ:* ʀᴇᴠɪɴᴢᴀ
│◧ *ʙᴏᴛɴᴀᴍᴇ:* ᴠᴏʀᴛʜʏx
│◧ *ᴠᴇʀꜱɪᴏɴ:* ɴᴇᴡ
│◧ *ᴛʏᴘᴇ:* ᴘʟᴜɢɪɴs
│◧ *ᴘʀᴇғɪx:* [ ${prefix} ]
│◧ *ᴛɪᴍᴇ:* ${wib} WIB
│◧ *ꜱᴛᴀᴛᴜꜱ:* ${statusUser}
╰───────────────☣︎

Precision over chaos. Execute with intent.
Press the button to proceed...
`;

 
            let img = await generateWAMessageContent({
                image: rvnz  
            }, { upload: sock.waUploadToServer });

 
            const msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            header: {
                                hasMediaAttachment: true,
                                imageMessage: img.imageMessage
                            },
                            body: {
                                text: teks
                            },
                            footer: {
                                text: `Vorthyx Base`
                            },
                            nativeFlowMessage: {
                                messageParamsJson: JSON.stringify({
                                    limited_time_offer: {
                                        text: "｢𒀱ꪳ｣",
                                        url: "https://t.me/ReVinzzaModss",
                                        copy_code: " ʀᴇᴠɪɴᴢᴀᴍᴏᴅss",
                                        expiration_time: Date.now() + 86400000
                                    },
                                    bottom_sheet: {
                                        in_thread_buttons_limit: 1,
                                        divider_indices: [1, 2, 3, 4, 5, 6, 7, 8, 999],
                                        list_title: "</>",
                                        button_title: "</>"
                                    }
                                }),
                                buttons: [
                                    { 
                                        name: 'galaxy_message', 
                                        buttonParamsJson: JSON.stringify({
                                            flow_cta: '⚠︎━━━━━━━━━━━  𝘝ØⱤ₮ⱧɎ𝘹  ━━━━━━━━━━━⚠︎',
                                            flow_message_version: '3',
                                        })
                                    },
                                    {
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            icon: "SETTINGS",
                                            title: "FunMenu",
                                            sections: [
                                                {
                                                    title: "FEATURES",
                                                    rows: [
                                                        { title: "GROUPS MENU", description: "", id: `${prefix}grupmenu` },
                                                        { title: "MAIN MENU", description: " ", id: `${prefix}mainmenu` }, 
                                                        { title: "BUG MENU", description: "", id: `${prefix}bugmenu` }
                                                    ]
                                                }
                                            ]
                                        })
                                    },
                                    {
                                        name: "cta_copy",
                                        buttonParamsJson: JSON.stringify({
                                            icon: "COPY",
                                            display_text: "𝘝𝘰𝘳𝘵𝘩𝘺𝘹",
                                            copy_code: "https://t.me/ReVinzzaModss"
                                        })
                                    }, 
                                    { 
                                        name: 'galaxy_message', 
                                        buttonParamsJson: JSON.stringify({
                                            flow_cta: '⚠︎━━━━━━━━━━━  𝘝ØⱤ₮ⱧɎ𝘹  ━━━━━━━━━━━⚠︎',
                                            flow_message_version: '3',
                                        })
                                    }
                                ]
                            }
                        })
                    }
                }
            }, { quoted: m });

             
            await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

           
            if (fs.existsSync("./menu.mp3")) {
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
