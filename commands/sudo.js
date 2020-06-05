var userData = require('../userData.json')
const config = require('../config.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'sudo',
	description: 'Super User - Bot admins only.',
    args: true,
    usage: '<command> <@mention> [Rest of the command args]',
    guildOnly: false,
    aliases: ['su', 'bot'],
    cooldown: 0,
	execute(message, args, mention) {
        if (!config["bot-admins"].includes(message.author.id) || 
            userData[message.author.id].account.type.toLowerCase() != "admin") return message.channel.send("You can't run that.")

        if (args[0] == "addMoney") {
            try {
                userData[mention.id][args[1]] += parseInt(args[3])
                message.channel.send("Complete! Added $" + args[3])
            } catch {
                message.channel.send("Error, Something went wrong.")
            }
        } else if (args[0] == "removeMoney") {
            try {
                userData[mention.id][args[1]] -= parseInt(args[3])
                message.channel.send("Complete! Removed $" + args[3])
            } catch {
                message.channel.send("Error, Something went wrong.")
            }
        } else if (args[0] == "botBan") {
            userData[mention.id].account.type = "banned"
            message.channel.send("Complete! " + mention.username + " was banned!")
        } else if (args[0] == "botUnban") {
            userData[mention.id].account.type = "user"
            message.channel.send("Complete! " + mention.username + " was unbanned!")
        } else if (args[0] == "set") {
            userData[mention.id].account.type = args.splice(2).join(" ")
            message.channel.send("Complete! " + mention.username + " is now a " + args.splice(2).join(" ") + "!")
        } else {
            message.channel.send("That's not a valid command.")
        }
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}