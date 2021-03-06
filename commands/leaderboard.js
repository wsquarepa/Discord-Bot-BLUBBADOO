const userData = require('../userData.json')
const teamData = require('../teams.json')
const fs = require('fs');
const discord = require("discord.js")

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = {
    name: 'leaderboard',
    description: 'See the world\'s leaders!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['leader', 'board', 'lb'],
    cooldown: 5,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        message.channel.send("Creating leaderboard... please wait.").then(function (msg) {
            if (!args.length) {
                var leaders = []
                var keys = Object.keys(userData)
                var dict = {}


                Object.assign(dict, userData)

                for (var i = 0; i < keys.length; i++) {
                    if (dict[keys[i]].account.type.toLowerCase() == "admin" || dict[keys[i]].account.type.toLowerCase() == "banned" || !isEmpty(dict[keys[i]].loan)) {
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
                    if (userData[message.author.id].account.type.toLowerCase() == "admin") {
                        footer = "You don't show on the leaderboard because you are a bot admin"
                    } else {
                        footer = "You don't show on the leaderboard because you loaned something."
                    }
                }

                leaders = items.slice(0, 5);

                var leaderString = ""

                for (var i = 0; i < leaders.length; i++) {
                    leaderString += leaders[i][0] + " - [$" + leaders[i][1] + "](" + msg.url + ")\n"
                }

                msg.edit("", embed("THE WORLD'S LEADERS: FIRST 5", leaderString, "2f3237").setFooter(footer).setTimestamp(Date.now()))
            } else if (args[0].startsWith("t")) {
                var leaders = []
                var keys = Object.keys(teamData)
                var dict = {}
                Object.assign(dict, teamData)

                // Create items array
                var items = Object.keys(dict).map(function (key) {
                    return [dict[key].name, dict[key].money];
                });

                items.sort(function (first, second) {
                    return second[1] - first[1];
                });

                var footer = ""
                if (!userData[message.author.id].team == "") {
                    var userLocation = items.findIndex((x) => x[0] == teamData[userData[message.author.id].team].name) + 1
                    footer = "Your team is #" + userLocation + " of " + keys.length + " teams."
                } else {
                    footer = "You are not in a team, so I can't tell you your team location."
                }

                leaders = items.slice(0, 5);

                var leaderString = ""

                for (var i = 0; i < leaders.length; i++) {
                    leaderString += leaders[i][0] + " - [$" + leaders[i][1] + "](" + msg.url + ")\n"
                }

                msg.edit("", embed("THE WORLD'S TOP TEAMS: FIRST 5", leaderString, "2f3237").setFooter(footer).setTimestamp(Date.now()))
            } else if (args[0].startsWith("s")) {
                var leaders = []
                var keys = Object.keys(userData)
                var dict = {}

                Object.assign(dict, userData)

                for (var i = 0; i < keys.length; i++) {
                    if (
                        dict[keys[i]].account.type.toLowerCase() == "admin" ||
                        dict[keys[i]].account.type.toLowerCase() == "banned" ||
                        message.guild.members.cache.find(y => y.id == keys[i]) == null
                    ) {
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
                    leaderString += leaders[i][0] + " - [$" + leaders[i][1] + "](" + msg.url + ")\n"
                }

                msg.edit("", embed("THE SERVER'S LEADERS: FIRST 5", leaderString, "2f3237").setFooter(footer).setTimestamp(Date.now()))
            }
        })
    }
}