const discord = require('discord.js');

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

client.on("message", (message) => {
    if (message.author.bot) return;
    
    var mention = message.mentions.users.first()
    
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
        if (!(message.member.hasPermission("ADMINISTRATOR"))) return;
        if (mention == null) return;
        if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return
        let reason = message.content.slice(prefix.length + mention.toString() + 5)
        message.channel.send(mention.username + ' has been banned.')
        mention.sendMessage("You have been banned because: \n" + reason).then(d_msg => {
            message.guild.member(mention).ban(reason)
        })
    }

    if (message.content.startsWith("kick")) {
        if (!(message.member.hasPermission("ADMINISTRATOR"))) return;
        if (mention == null) return;
        if (message.guild.member(mention).hasPermission("KICK_MEMBERS")) return;
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
});

client.login(token)