var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const language = require('./langOptions');
const translate = require('@vitalets/google-translate-api');
const speech = require('./messages');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                console.log("test 1");
                
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'intro':
                console.log("test 2");
                
                bot.sendMessage({
                    to: channelID,
                    message: 'Selamat Datang bro'
                });
            break;

            case 'translate':
                if (args.length < 3) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'salah kontol!!'
                    });
                }
                else{
                    let argFrom = args[0].toLowerCase();
                    let argTo = args[1].toLowerCase();

                    let lang_from = language.filter(ele => ele.name === argFrom)[0].abrv;
                    let lang_to = language.filter(ele => ele.name=== argTo)[0].abrv;
                    let text = args.slice(2).join(' ');

                
                    translate(text, {from: lang_from, to: lang_to})
                        .then(res => {bot.sendMessage({
                            to: channelID,
                            message: res.text
                        });})
                        .catch(err => {console.log(speech.BOT_TRANSLATION_ERROR + err)});
                
                }      
            break;
        }
     }
});