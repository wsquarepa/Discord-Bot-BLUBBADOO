const discord = require('discord.js')
const guildData = require('../guildData.json')

module.exports = {
    name: 'embed',
	description: 'Create an embed!',
    args: true,
    usage: '<embed JSON>',
    guildOnly: true,
    aliases: [],
    cooldown: 2,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        var json = message.content.slice((guildData[message.guild.id].prefix + 'embed ').length)
        try {
            var embedJSON = JSON.parse(json)
        } catch {
            message.channel.send("Whoops! That's not valid JSON!")
            return false
        }

        var embed = new discord.MessageEmbed(embedJSON)
        message.channel.send(embed)
    }
}