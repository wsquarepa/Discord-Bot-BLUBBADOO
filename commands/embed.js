const discord = require('discord.js')

module.exports = {
    name: 'embed',
	description: 'Create an embed!',
    args: true,
    usage: '<embed JSON>',
    guildOnly: true,
    aliases: [],
    cooldown: 2,
	execute(message, args, mention) {
        var json = message.content.slice('.embed '.length)
        try {
            var embedJSON = JSON.parse(json)
        } catch {
            message.channel.send("Whoops! That's not valid JSON!")
            return
        }

        var embed = new discord.MessageEmbed(embedJSON)
        message.channel.send(embed)
    }
}