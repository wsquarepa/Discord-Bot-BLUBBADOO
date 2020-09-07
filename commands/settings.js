var guildData = require('../guildData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'settings',
	description: 'Settings for your server - requires manage server permissions',
    args: false,
    usage: '[setting] [value]',
    guildOnly: true,
    aliases: [':gear:'],
    cooldown: 1,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD") && args.length > 0) {
            message.channel.send("You can't do that, buddy!")
            return
        }

        const guild = guildData[message.guild.id]

        if (!args.length) {
            const embed = new discord.MessageEmbed()
            embed.setTitle("Server settings:")
            embed.setDescription("Prefix: " + guild.prefix)
            embed.addField("Level up messages: ", guild.settings.levelUpMessages? "ON":"OFF")
            embed.addField("Money exceeding messages: ", guild.settings.moneyExceedMessage? "ON":"OFF")
            embed.addField("Race completion DM message: ", guild.settings.raceCompletionMessage? "ON":"OFF")
            embed.addField("Achievement earned message: ", guild.settings.achivementMessage? "ON":"OFF")
            embed.setColor(functions.globalEmbedColor)
            embed.setFooter("==settings help - for help")
            message.channel.send(embed)
        } else if (args[0] == "prefix") {
            if (!args[1]) {
                message.channel.send("You gotta supply a prefix; it can't be undefined.")
                return
            }

            guildData[message.guild.id].prefix = args.slice(1).join(" ")
            if (args.slice(1).join(" ") != "==") {
                message.guild.members.cache.get("596715111511490560").setNickname("[" + args.slice(1).join(" ") + "] Blubbadoo")
            } else {
                message.guild.members.cache.get("596715111511490560").setNickname("Blubbadoo")
            }
            message.channel.send("Complete! Server prefix set to `" + args.slice(1).join(" ") + "`!")
        } else if (args[0] == "messages") {
            if (args[1] == "levelup") {
                if (!args[2] || (args[2] != "on" && args[2] != "off")) {
                    message.channel.send("You have to choose `on` or `off`")
                    return
                }

                if (args[2] == "on") {
                    guildData[message.guild.id].settings.levelUpMessages = true
                } else {
                    guildData[message.guild.id].settings.levelUpMessages = false
                }
            } else if (args[1] == "moneyexceed") {
                if (!args[2] || (args[2] != "on" && args[2] != "off")) {
                    message.channel.send("You have to choose `on` or `off`")
                    return
                }

                if (args[2] == "on") {
                    guildData[message.guild.id].settings.moneyExceedMessage = true
                } else {
                    guildData[message.guild.id].settings.moneyExceedMessage = false
                }
            } else if (args[1] == "racecompletion") {
                if (!args[2] || (args[2] != "on" && args[2] != "off")) {
                    message.channel.send("You have to choose `on` or `off`")
                    return
                }

                if (args[2] == "on") {
                    guildData[message.guild.id].settings.raceCompletionMessage = true
                } else {
                    guildData[message.guild.id].settings.raceCompletionMessage = false
                }
            } else if (args[1] == "achievements") {
                if (!args[2] || (args[2] != "on" && args[2] != "off")) {
                    message.channel.send("You have to choose `on` or `off`")
                    return
                }

                if (args[2] == "on") {
                    guildData[message.guild.id].settings.achivementMessage = true
                } else {
                    guildData[message.guild.id].settings.achivementMessage = false
                }
            } else if (args[1] == "all") {
                if (!args[2] || (args[2] != "on" && args[2] != "off")) {
                    message.channel.send("You have to choose `on` or `off`")
                    return
                }

                if (args[2] == "on") {
                    guildData[message.guild.id].settings.levelUpMessages = true
                    guildData[message.guild.id].settings.moneyExceedMessage = true
                    guildData[message.guild.id].settings.raceCompletionMessage = true
                    guildData[message.guild.id].settings.achivementMessage = true
                } else {
                    guildData[message.guild.id].settings.levelUpMessages = false
                    guildData[message.guild.id].settings.moneyExceedMessage = false
                    guildData[message.guild.id].settings.raceCompletionMessage = false
                    guildData[message.guild.id].settings.achivementMessage = false
                }
            } else {
                message.channel.send("Could not find setting.")
                return
            }

            if (args[1] != "all") {
                message.channel.send("Turned setting " + args[1] + " " + args[2])
            } else {
                message.channel.send("Turned all settings " + args[2])
            }
        } else if (args[0] == "help") {
            message.channel.send("**SETTINGS HELP** \n" + 
            "*==settings* - shows your server settings \n" + 
            "*==settings prefix <prefix>* - set server prefix \n" + 
            "*==settings messages <levelup | moneyexceed | racecompletion | achievements | **ALL**> <on | off>* - toggle messages")
        }
        fs.writeFile("./guildData.json", JSON.stringify(guildData), (err) => err !== null ? console.error(err) : null)
    }
}