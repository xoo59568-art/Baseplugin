const fs = require('fs');
const chalk = require('chalk');

global.owner = ['917439382677'];  
global.premium = ['917439382677'];
global.packname = '𓋜 -𝐑ᴀ፝֟፝֟ʙʙɪᴛ/>𝟑ن𓂃';
global.author = '𓋜 -𝐑ᴀ፝֟፝֟ʙʙɪᴛ/>𝟑ن𓂃';
global.prefix = '.'; 


let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.yellowBright(`Update detected on: ${file}`));
    delete require.cache[file];
    require(file);
});
