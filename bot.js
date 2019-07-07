const discord = require('discord.js');

var client = new discord.Client();

const token = "NTk2NzE1MTExNTExNDkwNTYw.XSFriA.xz3pHbVKO8HrEbWRJ2jEkNiTiPM"

client.on("ready", async () => {
    console.log("ready!")
    client.user.setActivity("I AM BLUBBADOO PREMIUM")
    client.user.setStatus("online")
});

const prefix = '==';
var passwordMode = false;
var userUsingPassword = ''

client.on("message", (message) => {
    if (message.author.bot) return;
    
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
});

client.login(token)