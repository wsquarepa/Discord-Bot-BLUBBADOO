const userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'getobject',
	description: 'Get user object',
    args: true,
    usage: '<mention>',
    guildOnly: false,
    aliases: ['getuser'],
    cooldown: 0,
    levelRequirement: 0,
    category: "economy",
    adminOnly: true,
	execute(message, args, mention) {
        if (!mention) {
            message.channel.send("Misread `args[0]`: Mention")
            return;
        }

        message.channel.send("```JSON \n" + JSON.stringify(userData[mention.id]) + "\n```")
    }
}