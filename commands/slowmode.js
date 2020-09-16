const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'slowmode',
	description: 'Set slowmode for a channel',
    args: false,
    usage: '<seconds>',
    guildOnly: false,
    aliases: ['sm'],
    cooldown: 3,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        if (args[0] == "off") {
            args[0] == 0
        }

        if (isNaN(parseInt(args[0]))) {
            message.channel.send("Not a valid slowmode timout. Must be a number (seconds) or `off`")
            return false;
        }

        message.channel.setRateLimitPerUser(args[0])
        message.channel.send("Complete! Channel slowmode set to `" + args[0] + "` seconds!")
    }
}