var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'keyargs',
	description: 'Key argument descriptions',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "info",
    adminOnly: true,
	execute(message, args, mention, specialArgs) {
        const embed = new discord.MessageEmbed()
        embed.setTitle("Known keyArgs Args:")
        embed.setDescription(
            'Use `-`, `.`, `>`, `+`, `$` or `!` for it' +
            '```fix' + 
            `
b -> Bypass all cooldowns, health and level
f -> Force command to work, bypassing all permissions
            ` + 
            '```'
        )
        embed.setColor(functions.globalEmbedColor)
        message.channel.send(embed)
    }
}