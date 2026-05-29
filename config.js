const fs = require('fs');
const chalk = require('chalk');

global.owner = ['6283167006954'];  
global.premium = ['6283167006954'];
global.packname = 'ʀᴇᴠɪɴᴢᴀ-ʙᴏᴛ';
global.author = 'RevinzaModsd';
global.prefix = '.'; 


let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.yellowBright(`Update detected on: ${file}`));
    delete require.cache[file];
    require(file);
});
