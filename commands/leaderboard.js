var userData = require('../userData.json')
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
    name: 'leaderboard',
	description: 'See the world\'s leaders!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['leader', 'board'],
    cooldown: 7.5,
	execute(message, args, mention) {
        var leaders = []
        var keys = Object.keys(userData)
        var dict = {}

        Object.assign(dict, userData)

        for (var i = 0; i < keys.length; i++) {
            if (dict[keys[i]].account.type.toLowerCase() == "admin") {
                delete dict[keys[i]]
            }
        }

        // Create items array
        var items = Object.keys(dict).map(function (key) {
            return [dict[key].username, dict[key].cash];
        });

        items.sort(function (first, second) {
            return second[1] - first[1];
        });

        var userLocation = items.findIndex((x) => x[0] == message.author.username) + 1

        var footer = "You are #" + userLocation + " of " + keys.length + " users."

        if (userLocation == 0) {
            footer = "You are a bot ADMIN, you do not show on the leaderboard."
        }
        
        leaders = items.slice(0, 5);

        var leaderString = ""

        for (var i = 0; i < leaders.length; i++) {
            leaderString += leaders[i][0] + " - $" + leaders[i][1] + "\n"
        }

        message.channel.send(embed("THE WORLD'S LEADERS: FIRST 5", leaderString, "fffffa").setFooter(footer))
    }
}