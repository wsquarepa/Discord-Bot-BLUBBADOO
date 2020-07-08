const userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const achivements = require("../jsHelpers/achivements")

module.exports = {
    name: 'achievements',
	description: 'View your achievements!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['achivements'],
    cooldown: 5,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        var userAchivements = userData[message.author.id].achivements
        var embed = new discord.MessageEmbed()
            .setTitle("Your achievements:")
            .setColor("00ff00")

        for (var i = 0; i < userAchivements.length; i++) {
            embed.addField(userAchivements[i], achivements[userAchivements[i]].description)
        }

        message.channel.send(embed)
    }
}