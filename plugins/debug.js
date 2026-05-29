const { generateWAMessageContent, generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
const util = require('util');

module.exports = {
  command: ['debug', 'inspect', 'json'],
  isOwner: true,

  run: async (sock, m) => {
   
    if (!m.quoted) return m.reply('Reply/kuot pesan yang ingin kamu debug.');

    try {
      let quotedData = m.quoted;

      
      let output = util.inspect(quotedData, { depth: 5 }); 


      return m.reply(output);
    } catch (e) {

      return m.reply(String(e));
    }
  }
};
