const discord = require('discord.js');
const fs = require('fs')

var client = new discord.Client();

const token = "NTk2NzE1MTExNTExNDkwNTYw.XSFriA.xz3pHbVKO8HrEbWRJ2jEkNiTiPM"

client.on("ready", async () => {
    console.log("ready!")
    client.user.setActivity("Still in development")
    client.user.setStatus("online")
});

const prefix = '==';
var passwordMode = false;
var userUsingPassword = ''

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
        }
}


client.on("message", (message) => {
    if (message.author.bot) return;
    
    var mention = message.mentions.users.first()

    fs.readFile("accepted-servers.txt", function(err, buf) {
        if (err) stop();

        var hashcode = buf.toString()
        var guildIDS = hashcode.split('\n')
        var len = guildIDS.length
        var accepted = false;

        for (i = 0; i <= len; i++) {
            if (guildIDS[i] == message.guild.id){
                accepted = true
            }
        }

        if (!(accepted) && message.content.startsWith(prefix)) {
            message.channel.send("HOW DID YOU GET ME")
	    return;
        }

        
    });

    if (1 == 1) {

    }

    if (message.content.startsWith(prefix + 'blubbadoo')) {
        message.channel.send("Blubbadoo!!!")
    }

    if (message.content.startsWith(prefix + "develop")) {
        message.delete(500)
        message.reply("Enter the password.").then(deleteMessage => deleteMessage.delete(3000))
        passwordMode = true;
        userUsingPassword = message.author.id
        client.user.setStatus("dnd")
    }

    if (message.content.startsWith("javascript") && passwordMode && message.author.id == userUsingPassword) {
        message.delete(500)
        message.reply("Test mode activiated").then(d_msg => d_msg.delete(3000))
        client.user.setStatus("online")
    }

    if (message.content.startsWith("ban")) {
        if (!(message.member.hasPermission("ADMINISTRATOR")) || !(message.member.id == 509874745567870987)) return;
        if (mention == null) return;
        if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return
        let reason = message.content.slice(prefix.length + mention.toString() + 5)
        message.channel.send(mention.username + ' has been banned.')
        mention.sendMessage("You have been banned because: \n" + reason).then(d_msg => {
            message.guild.member(mention).ban(reason)
        })
    }

    if (message.content.startsWith("kick") || !(message.member.id == 509874745567870987)) {
        if (!(message.member.hasPermission("ADMINISTRATOR"))) return;
        if (mention == null) return;
        if (message.guild.member(mention).hasPermission("KICK_MEMBERS")) {
            message.channel.send("YOU NO KICK " + mention.toString() + "!!!")
            return;
        }
        let reason = message.content.slice(prefix.length + mention.toString() + 5)
        message.channel.send(mention.username + ' has been kicked.')
        mention.sendMessage("You have been kicked because: \n" + reason).then(d_msg => {
            message.guild.member(mention).kick(reason)
        })
    }

    if (message.content.startsWith(prefix + "embeddie")) {
        var embed = new discord.RichEmbed() 
            .setAuthor("Blubbaddo Premium")
            .setDescription("This tis a embed")
            .addField("WOOOOOOO")
            .setThumbnail("https://cdn.discordapp.com/attachments/594272503837229092/594272672700170268/Drawing.png")
            .setColor("ffffff")
            .setFooter("NEWWWY")

        message.channel.send(embed)
    }

    if (message.content.startsWith(prefix + "acceptServer")) {
        if (message.author.id == 509874745567870987) {
            fs.appendFile("accepted-servers.txt", (message.guild.id), (err) => {
                if (err) stop()
                sleep(2500)
                message.channel.send("Added to accepted servers.")
            });
        } else {
            message.reply("You cannot run this command.")
        }
    }

    //message.channel.send(message.guild.id.toString())
});

client.login(token)
