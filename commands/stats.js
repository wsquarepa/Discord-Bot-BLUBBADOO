var userData = require('../userData.json')
const botData = require('../botData.json')
const fs = require('fs');
const discord = require("discord.js")
const guildData = require('../guildData.json')
const { version } = require('../package.json')

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
    usage: '[command name]',
    guildOnly: true,
    aliases: ['polls'],
    cooldown: 2,
    category: "info",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        const { commands } = message.client;
        if (!args.length) {
            var leaders = []
            var keys = Object.keys(botData)
            var dict = {}

            Object.assign(dict, botData)

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
                timeAgo = Math.round((timeAgo + Number.EPSILON))
                leaderString += leaders[i][0] + " - used " + leaders[i][1] + " times. \n Last used ≈" + timeAgo + " minutes ago.\n \n"
            }

            message.client.shard.fetchClientValues('guilds.cache.size')
                .then(results => {
                    const guilds = results.reduce((acc, guildCount) => acc + guildCount, 0)
                    message.channel.send(embed("STATS", "**Top 5 most used commands:** \n " + leaderString +
                        "\n **Bot Servers:** " + guilds + 
                        "\n **Version:** " + version, "2f3237"))
                })
                .catch(error => console.error("[SHARD/ERROR] " + error));
            return
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (command.adminOnly) {
            message.reply('that\'s not a valid command!');
            return false
        }

        const now = Date.now()
        var timeAgo = now - botData[command.name].lastUsed
        timeAgo = timeAgo / 1000 / 60
        timeAgo = Math.round((timeAgo + Number.EPSILON))

        var data = []
        data.push("**" + command.name + " " + command.usage +"**")
        data.push("Used **" + botData[command.name].uses + "** times")
        data.push("Last used **≈" + timeAgo + "** minutes ago.")

        message.channel.send(data)
    }
}