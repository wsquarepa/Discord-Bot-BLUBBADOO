var guildData = require('../guildData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'settings',
	description: 'Settings for your server - requires manage server permissions',
    args: false,
    usage: '[setting] [value]',
    guildOnly: true,
    aliases: [':gear:'],
    cooldown: 1,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD") && args.length > 0) {
            message.channel.send("You can't do that, buddy!")
            return
        }

        const guild = guildData[message.guild.id]

        if (!args.length) {
            const embed = new discord.MessageEmbed()
            embed.setTitle("Server settings:")
            embed.setDescription("Prefix: " + guild.prefix)
            embed.addField("Level up messages: ", guild.settings.levelUpMessages? "ON":"OFF")
            embed.addField("Money exceeding messages: ", guild.settings.moneyExceedMessage? "ON":"OFF")
            embed.addField("Race completion DM message: ", guild.settings.raceCompletionMessage? "ON":"OFF")
            embed.addField("Achivement earned message: ", guild.settings.achivementMessage? "ON":"OFF")
            embed.setColor(functions.globalEmbedColor)
            message.channel.send(embed)
        } else if (args[0] == "prefix") {
            if (!args[1]) {
                message.channel.send("You gotta supply a prefix; it can't be undefined.")
                return
            }

            guildData[message.guild.id].prefix = args.slice(1).join(" ")
            message.channel.send("Complete! Server prefix set to `" + args.slice(1).join(" ") + "`!")
        }
    }
}