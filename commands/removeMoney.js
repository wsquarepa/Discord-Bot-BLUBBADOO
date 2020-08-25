var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'removeMoney',
	description: 'Remove money from a user',
    args: true,
    usage: '<@mention> <cash|bank> <amount>',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "economy",
    adminOnly: true,
	execute(message, args, mention) {
        const amount = parseInt(args[3])
        if (!amount) {
            message.channel.send("Enter a valid amount!")
            return;
        }

        if (!mention) {
            message.channel.send("Mention someone!")
            return;
        }

        if (!args[1]) {
            message.channel.send("Enter a valid type!")
            return;
        }

        try {
            userData[mention.id][args[1]] -= amount
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            message.channel.send("Complete! Removed " + args[3] + " " + args[1] +"(s) from users\n Current user status: \n ```json\n" + JSON.stringify(userData[mention.id]) + "\n```")
        } catch(e) {
            console.error(e)
            message.channel.send("Error, Something went wrong.")
        }
    }
}