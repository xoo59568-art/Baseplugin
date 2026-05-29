const util = require('util');

module.exports = {
  command: ['eval', 'x'],
  isOwner: true,

  run: async (sock, m, { text }) => {
    if (!text) return m.reply('Masukkan kode JavaScript.');

    try {
      const asyncEval = `(async () => { ${text} })()`;
      let evaled = await eval(asyncEval);

      if (typeof evaled !== 'string') {
        evaled = util.inspect(evaled);
      }

      return m.reply(evaled);
    } catch (e) {
      return m.reply(String(e));
    }
  }
};