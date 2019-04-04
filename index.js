const Discord = require('discord.js');
const Request = require('request');
const Schedule = require('node-schedule');
const bot = new Discord.Client();
const config = require("./config.json");
const token = config.token;
bot.login(token);
bot.on('ready', async (guild) => {
	    console.log('Bot is ready');
    let t = Schedule.scheduleJob('* * * * *', function() {
        let date = new Date();
        let min = date.getMinutes();
        bot.user.setActivity(`Next quote in ${60 - min} mins`);
    })
    let j = Schedule.scheduleJob('1 * * * *', function() {
        Request('https://api.kanye.rest/', {
            json: true
        }, (err, res, body) => {
            let quote = body.quote;
            let embed = new Discord.RichEmbed()
                .setTitle("**Your hourly Kanye West Twitter quote!**")
                .setThumbnail(bot.user.avatarURL)
                .setColor("#1DA1F2")
                .addField(`${quote}`, "*-Kanye West 3019*")
            let channel = bot.guilds.forEach(g => {
                g.channels.filter(x => x.type === "text").filter(y => y.memberPermissions(g.me).has("SEND_MESSAGES")).first().send(embed)
            })
        });
    });
});
bot.on("guildCreate", async (guild) => {
    let embed = new Discord.RichEmbed()
        .setThumbnail(bot.user.avatarURL)
        .setColor("#1DA1F2")
        .addField(`Greetings people of **${guild.name}**`, "Get your dose of Kanye West Twitter enlightment every hour straight from within Discord.")
        .addField("Coded by:", "[L34ND3V](https://github.com/TasosY2K)")
        .addField("API's used:", "[discord.js](https://discord.js.org)\n[kanye.rest](https://kanye.rest)")
    let channelID;
    let channels = guild.channels;
    channelLoop:
        for (let c of channels) {
            let channelType = c[1].type;
            if (channelType === "text") {
                channelID = c[0];
                break channelLoop;
            }
        }
    let channel = bot.channels.get(guild.systemChannelID || channelID);
    channel.send(embed);
});
