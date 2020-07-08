const userData = require('../userData.json')
const discord = require('discord.js')

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

module.exports = {
    name: 'profile',
    description: 'See your profile!',
    args: false,
    usage: '[@mention]',
    guildOnly: true,
    aliases: ['prof'],
    cooldown: 5,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {

        if (mention == null) {
            var name = message.author.username
            var cash = userData[message.author.id].cash
            var bank = userData[message.author.id].bank
            var gems = userData[message.author.id].gems
            var type = userData[message.author.id].account.title
            var secured = userData[message.author.id].account.secured
            var xp = userData[message.author.id].xp
            var xpUntil = userData[message.author.id].xpUntil
            var level = userData[message.author.id].level
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
            if (userLocation == 0) userLocation = "Not on leaderboard"

            var embed = new discord.MessageEmbed({
                title: "Your profile",
                color: "000aa0"
            })

            var xpChart = ['|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|']

            var loc = parseInt(10.0 * (xp / xpUntil) + 0.5)

            xpChart[loc] = "**|**"

            //embed.addField("Username:", name, false)
            embed.addField("Cash", cash, true)
            embed.addField("Bank", bank, true)
            embed.addField("Gems", gems, true)
            //embed.addField("\u200b", "\u200b", false)
            embed.addField("Title", type, true)
            embed.addField("Secured?", secured, true)
            embed.addField("Leaderboard Location", userLocation, true)
            //space
            embed.addField("XP", xpChart.join("") + " \n " + xp + "/" + xpUntil, true)
            embed.addField("Level", level, true)

            message.channel.send(embed)
        } else {
            var name = mention.username
            var cash = userData[mention.id].cash
            var bank = userData[mention.id].bank
            var gems = userData[mention.id].gems
            var type = userData[mention.id].account.title
            var xp = userData[mention.id].xp
            var xpUntil = userData[mention.id].xpUntil
            var level = userData[mention.id].level
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

            var userLocation = items.findIndex((x) => x[0] == mention.username) + 1
            if (userLocation == 0) userLocation = "Not on leaderboard"
            var embed = new discord.MessageEmbed({
                title: name + "'s profile",
                color: "000aa0"
            })

            var xpChart = ['|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|']

            var loc = parseInt(10.0 * (xp / xpUntil) + 0.5)

            xpChart[loc] = "**|**"

            embed.addField("Cash", cash, true)
            embed.addField("Bank", bank, true)
            embed.addField("Gems", gems, true)

            embed.addField("Title", type, true)
            embed.addField("Secured?", "Access Denied", true)
            embed.addField("Leaderboard Location", userLocation, true)

            embed.addField("XP", xpChart.join("") + " \n " + xp + "/" + xpUntil, true)
            embed.addField("Level", level, true)

            message.channel.send(embed)
        }
    }
}