const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")
var guildData = require("../guildData.json")

module.exports = {
    name: 'warn',
	description: 'Warn a user in your server',
    args: true,
    usage: '<@mention> [reason]',
    guildOnly: true,
    aliases: [],
    cooldown: 4,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
            message.channel.send("You cannot do that, my friend!")
            return;
        }

        if (!mention) {
            message.channel.send("It's not gonna work if you mention my friend `undefined`...")
            return;
        }

        var reason = ""

        if (!args[1]) {
            reason = "No reason given."
        } else {
            reason = args.slice(1).join(" ")
        }

        guildData[message.guild.id].warnings.push({
            user: mention.id,
            reason: reason,
            moderator: message.author.id
        })
        fs.writeFile("./guildData.json", JSON.stringify(guildData), (err) => err !== null ? console.error(err) : null)

        mention.send("You were warned in **" + message.guild.name + "** for: `" + reason + "`.")
        message.channel.send("**" + mention.tag + "** has been warned for: `" + reason + "`")
    }
}