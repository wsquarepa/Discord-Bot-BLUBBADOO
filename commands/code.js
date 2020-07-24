var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const codes = require("../jsHelpers/codes")

module.exports = {
    name: 'code',
	description: 'Enter a code to earn money or stuff.',
    args: true,
    usage: '<code>',
    guildOnly: false,
    aliases: [],
    cooldown: 10,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        var codeKeys = Object.keys(codes)
        if (codeKeys.includes(args[0]) && !userData[message.author.id].codesUsed.includes(args[0])) {
            userData[message.author.id].codesUsed.push(args[0])

            var stuffEarn = codes[args[0]]
            userData[message.author.id].bank += stuffEarn.money
            userData[message.author.id].gems += stuffEarn.gems
            if (stuffEarn.item != "") {
                if (userData[message.author.id].inventory[stuffEarn.item]) {
                    userData[message.author.id].inventory[stuffEarn.item].amount += 1
                } else {
                    userData[message.author.id].inventory[stuffEarn.item] = {
                        amount: 1,
                        uses: 1
                    }
                }
            }

            if (stuffEarn.title != "") {
                userData[message.author.id].account.title = stuffEarn.title
            }

            var embed = new discord.MessageEmbed()
                .setTitle("WINNER!")
                .setDescription("The code exists!")
                .setColor("00ff00")
                .addField("Money: ", stuffEarn.money)
                .addField("Gems: ", stuffEarn.gems)

            if (stuffEarn.item != "") {
                embed.addField("Item: ", stuffEarn.item)
            }

            if (stuffEarn.title != "") {
                embed.addField("Title: ", stuffEarn.title)
            }

            message.channel.send(embed)
        } else {
            var embed = new discord.MessageEmbed()
                .setTitle("Upsies!")
                .setDescription("Not a valid code.")
                .setColor("ff0000")
            
            message.channel.send(embed)
        }
    }
}