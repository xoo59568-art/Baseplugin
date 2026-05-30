require('./config');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require('pino');
const express = require("express");
const app = express();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const readline = require("readline");
const NodeCache = require("node-cache");
const axios = require("axios");
const { serialize } = require('./system/helper');
const usePairingCode = true;
const question = (text) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(text, resolve));
};
const msgRetryCounterCache = new NodeCache();
global.plugins = {};
const loadPlugins = () => {
  const pluginsDir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir);
  
  const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
  for (let file of files) {
    try {
      const pluginPath = path.join(pluginsDir, file);
      delete require.cache[require.resolve(pluginPath)];
      const plugin = require(pluginPath);
      
      if (plugin.command) {
        global.plugins[file] = plugin;
      }
    } catch (e) {
      console.error(chalk.red(`[ ERROR ] Gagal memuat plugin ${file}:`), e);
    }
  }
  console.log(chalk.greenBright(`[ SYSTEM ] ${Object.keys(global.plugins).length} Plugins Loaded Successfully.`));
};

loadPlugins();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./sessions/main");
  let version;
  try {
    const latestVersion = await fetchLatestBaileysVersion();
    version = latestVersion.version;
    console.log(chalk.cyan(`[ SYSTEM ] Menggunakan Versi WhatsApp Web: ${version.join('.')}`));
  } catch (e) {
    version = [2, 3000, 1017502444];
    console.log(chalk.yellow("[ SYSTEM ] Gagal mengambil versi terbaru, menggunakan versi cadangan."));
  }
  const sock = makeWASocket({
    version: version,
    printQRInTerminal: !usePairingCode,
    logger: pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino().child({ level: 'silent' })),
    },
    browser: ["Mac OS", "Chrome", "124.0.0.0"],
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    connectTimeoutMs: 60000
  });
  if (usePairingCode && !sock.authState.creds.registered) {
    console.clear();
    console.log(chalk.bold.cyan("Revinza-Botz"));
    const phoneNumber = await question(chalk.yellowBright("\nMasukkan Nomor WhatsApp Anda (Format: 62xxxxxx):\n> "));
    const code = await sock.requestPairingCode(phoneNumber.trim());
    console.log(chalk.greenBright(`\nKode Pairing Anda: `) + chalk.bold.white.bgRed(` ${code} `) + `\n`);
  }
  sock.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return decode.user && decode.server && decode.user + '@' + decode.server || jid;
    } else return jid;
  };
  sock.ev.on('messages.upsert', async chatUpdate => {
    try {
      let chat = chatUpdate.messages[0];
if (!chat) return;

// Auto Status View
if (chat.key?.remoteJid === "status@broadcast") {
  await sock.readMessages([chat.key]).catch(() => {});
  console.log("✅ Status Viewed");
  return;
}

if (!chat.message) return;
      
      let m = serialize(sock, chat);
      if (m.isBot) return;
      
      const prefix = global.prefix;
      const isCmd = m.body.startsWith(prefix);
      const command = isCmd ? m.body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
      const args = m.body.trim().split(/ +/).slice(1);
      const text = args.join(" ");
      
      let groupMetadata = m.isGroup ? await sock.groupMetadata(m.chat).catch(() => null) : null;
      let participants = groupMetadata ? groupMetadata.participants : [];
      let groupAdmins = participants.filter(v => v.admin !== null).map(v => v.id);
      
      let isOwner = [sock.user.id.split(':')[0], ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
      let isPremium = isOwner || global.premium.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
      let isBotAdmin = groupAdmins.includes(sock.decodeJid(sock.user.id));
      let isAdmin = groupAdmins.includes(m.sender);
      
      if (m.body) {
        const timeLog = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const userName = m.pushName || "No Name";
        const chatType = m.isGroup ? chalk.yellowBright("[ GROUP ]") : chalk.cyanBright("[ PRIVATE ]");
        
        if (isCmd || command) {
          console.log(
            chalk.black.bgGreen(` ${timeLog} `) + " " +
            chalk.bold.black.bgWhite(` CMD `) + " " +
            chalk.greenBright(`${isCmd ? '' : prefix}${command || m.body.replace(prefix, '')}`) + " dari " +
            chalk.bold.white(userName) + " di " + chatType
          );
        } else {
          console.log(
            chalk.black.bgCyan(` ${timeLog} `) + " " +
            chalk.bold.black.bgBlue(` MSG `) + " " +
            chalk.white(m.body.length > 30 ? m.body.substring(0, 30) + "..." : m.body) + " dari " +
            chalk.bold.white(userName) + " di " + chatType
          );
        }
      }
      for (let name in global.plugins) {
        let plugin = global.plugins[name];
        if (!plugin) continue;
        
        const isTriggered = Array.isArray(plugin.command) ? plugin.command.includes(command) : plugin.command === command;
        
        if (isTriggered) {
          if (plugin.isOwner && !isOwner) { m.reply('*[ AKSES OWNER ]* Fitur ini dikunci khusus Owner!'); continue; }
          if (plugin.isPremium && !isPremium) { m.reply('*[ AKSES PREMIUM ]* Fitur ini khusus pengguna status Premium!'); continue; }
          if (plugin.isGroup && !m.isGroup) { m.reply('*[ GROUP ONLY ]* Perintah ini hanya bekerja di dalam Group!'); continue; }
          if (plugin.isAdmin && !isAdmin) { m.reply('*[ ADMIN ONLY ]* Fitur ini terkunci, Anda bukan Admin Group!'); continue; }
          if (plugin.isBotAdmin && !isBotAdmin) { m.reply('*[ BOT HARUS ADMIN ]* Fitur gagal, jadikan bot sebagai admin terlebih dahulu!'); continue; }
          
          await plugin.run(sock, m, { args, text, command, prefix, isOwner, isPremium, groupMetadata });
        }
      }
    } catch (err) {
      console.error(chalk.red("Error Upsert Engine: "), err);
    }
  });
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      if (statusCode === 515 || lastDisconnect?.error?.message?.includes('Stream Errored')) {
        console.log(chalk.yellow(`[ JARINGAN ] Stream terputus sejenak (515). Menghubungkan ulang secara otomatis...`));
      } else {
        console.log(chalk.red(`[ KONEKSI ] Terputus karena: `), lastDisconnect?.error?.message || lastDisconnect?.error, `, Reconnecting: ${shouldReconnect}`);
      }
      
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log(chalk.greenBright("\n[ SUCCESS ] Bot Terhubung Sempurna ke WhatsApp ✅\n"));
    }
  });
  
  sock.ev.on('creds.update', saveCreds);
}

startBot();
const app = express();

app.get("/", (req, res) => {
  res.json({
    status: true,
    bot: "Rabbit Multi Session",
    owner: "Rabbit"
  });
});

app.get("/sessions", (req, res) => {
  const sessions = fs.existsSync("./sessions")
    ? fs.readdirSync("./sessions")
    : [];

  res.json({
    status: true,
    total: sessions.length,
    sessions
  });
});

app.listen(3000, () => {
  console.log("[ API ] Running On Port 3000");
});
fs.watch(path.join(__dirname, 'plugins'), (eventType, filename) => {
  if (filename && filename.endsWith('.js')) {
    console.log(chalk.yellow(`[ WATCHER ] Perubahan terdeteksi pada plugin: ${filename}. Memuat ulang...`));
    loadPlugins();
  }
});
