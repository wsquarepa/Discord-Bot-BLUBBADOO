var userData = require('../userData.json')
const botData = require('../botData.json')
const fs = require('fs');
const discord = require("discord.js")

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

module.exports = {
    name: 'stats',
	description: 'See the stats of the bot!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['polls'],
    cooldown: 10,
	execute(message, args, mention) {
        var leaders = []
        var keys = Object.keys(botData)
        var dict = {}

        Object.assign(dict, botData)

        delete dict.messagesRecieved

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == "stats" || keys[i] == "sudo" || keys[i] == "reload" || keys[i] == "report") {
                delete dict[keys[i]]
            }
        }

        // Create items array
        var items = Object.keys(dict).map(function (key) {
            return [key, dict[key].uses, dict[key].lastUsed];
        });

        items.sort(function (first, second) {
            return second[1] - first[1];
        });
        
        leaders = items.slice(0, 5);

        var leaderString = ""

        for (var i = 0; i < leaders.length; i++) {
            const now = Date.now()
            var timeAgo = now - leaders[i][2]
            timeAgo = timeAgo / 1000 / 60
            timeAgo = Math.round((timeAgo + Number.EPSILON) * 100) / 100
            leaderString += "==" + leaders[i][0] + " - used " + leaders[i][1] + " times. \n Last used ≈" + timeAgo + " minutes ago.\n \n"
        }

        message.channel.send(embed("STATS", "**Last 5 used commands:** \n " + leaderString + 
        "\n **Number of chat messages recieved:** \n" + botData.messagesRecieved, "fffffa"))
    }
}