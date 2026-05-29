const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");

module.exports = {
  command: ['clone', 'ambil', 'duplikat'], 
  isOwner: true,                             

  run: async (sock, m) => {
    if (!m.quoted) return m.reply('❌ Reply/kuot pesan atau media apa saja yang mau kamu clone!');

    try {
      let targetMessage = m.quoted.message || m.quoted.rawMessage;

      if (!targetMessage) {
        const mtype = m.quoted.mtype;
        if (mtype) {
          targetMessage = {
            [mtype]: m.quoted
          };
        }
      }

      if (!targetMessage) {
        return m.reply(`❌ Gagal mengambil struktur data. Jenis pesan: ${m.quoted.mtype}`);
      }

      if (targetMessage.viewOnceMessageV2) {
        targetMessage = targetMessage.viewOnceMessageV2.message;
      } else if (targetMessage.viewOnceMessage) {
        targetMessage = targetMessage.viewOnceMessage.message;
      }
      if (targetMessage.imageMessage) targetMessage.imageMessage.viewOnce = false;
      if (targetMessage.videoMessage) targetMessage.videoMessage.viewOnce = false;

      let clonedPayload = generateWAMessageFromContent(m.chat, targetMessage, { 
        quoted: m 
      });

      await sock.relayMessage(m.chat, clonedPayload.message, {});

    } catch (e) {
      console.error(e);
      return m.reply(`❌ Gagal menduplikat pesan: ${e.message}`);
    }
  }
};
