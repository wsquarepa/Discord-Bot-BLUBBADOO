var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'emoji',
	description: 'Get emoji 😄',
    args: true,
    usage: '<emoji name>',
    guildOnly: true,
    aliases: [],
    cooldown: 3,
    levelRequirement: 0,
    category: "info",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        const emojiName = args.join(" ")
        const emoji = message.guild.emojis.cache.find(x => x.name == emojiName)

        if (!emoji) {
            message.channel.send("Sorry, but that emoji does not exist!")
            return;
        }

        const embed = new discord.MessageEmbed()
        embed.setTitle("Emoji \"" + emojiName + "\"")
        embed.addField("ID", emoji.id)
        embed.addField("Emoji", emoji.toString())
        embed.addField("Raw emoji form", "\\" + emoji.toString())
        embed.setColor(functions.globalEmbedColor)
        message.channel.send(embed)
    }
}