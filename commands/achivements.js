const userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const achivements = require("../jsHelpers/achivements")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'achievements',
	description: 'View your achievements!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['achivements', 'advancements'],
    cooldown: 5,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        var userAchivements = userData[message.author.id].achivements
        var achivementsCopy = {}
        Object.assign(achivementsCopy, achivements)
        var embed = new discord.MessageEmbed()
            .setTitle("Your achievements:")
            .setColor(functions.globalEmbedColor)

        for (var i = 0; i < userAchivements.length; i++) {
            embed.addField(userAchivements[i], achivements[userAchivements[i]].description, true)
            delete achivementsCopy[userAchivements[i]]
        }

        embed.addField("UNDONE ACHIVEMENTS", "\u200B", false)

        const undoneKeys = Object.keys(achivementsCopy)
        for (i = 0; i < undoneKeys.length; i++) {
            embed.addField(undoneKeys[i], achivements[undoneKeys[i]].description, true)
        }

        message.channel.send(embed)
    }
}