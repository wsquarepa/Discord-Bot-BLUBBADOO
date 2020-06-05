var userData = require('../userData.json')
const config = require('../config.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'sudo',
	description: 'Super User - Bot admins only.',
    args: true,
    usage: '<command> [command args | null]',
    guildOnly: false,
    aliases: ['su', 'bot'],
    cooldown: 0,
	execute(message, args) {
        if (!config["bot-admins"].includes(message.author.id)) return message.channel.send("You can't run that.")

        if (args[0] == "addMoney") {
            var mention = message.mentions.users.first()
            try {
                userData[mention.id][args[1]] += parseInt(args[3])
                message.channel.send("Complete! Added $" + args[3])
            } catch {
                message.channel.send("Error, Something went wrong.")
            }
        } else if (args[0] == "removeMoney") {
            var mention = message.mentions.users.first()
            try {
                userData[mention.id][args[1]] -= parseInt(args[3])
                message.channel.send("Complete! Removed $" + args[3])
            } catch {
                message.channel.send("Error, Something went wrong.")
            }
        } else if (args[0] == "botBan") {
            var mention = message.mentions.users.first()
            userData[mention.id].account.type = "banned"
            message.channel.send("Complete! " + mention.username + " was banned!")
        } else if (args[0] == "botUnban") {
            var mention = message.mentions.users.first()
            userData[mention.id].account.type = "user"
            message.channel.send("Complete! " + mention.username + " was unbanned!")
        } else {
            message.channel.send("That's not a valid command.")
        }
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}