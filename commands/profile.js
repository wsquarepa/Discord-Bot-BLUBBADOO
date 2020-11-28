var userData = require('../userData.json')
const discord = require('discord.js')
const functions = require("../jsHelpers/functions")
const guildData = require("../guildData.json")

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
    cooldown: 2,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {

        if (mention == null) {
            if (!args.length) {
                const cash = userData[message.author.id].cash
                const bank = userData[message.author.id].bank
                const gems = userData[message.author.id].gems
                const type = userData[message.author.id].account.title
                const secured = userData[message.author.id].account.secured
                const xp = userData[message.author.id].xp
                const xpUntil = userData[message.author.id].xpUntil
                const level = userData[message.author.id].level
                const intellect = userData[message.author.id].intellegencePoints
                const strength = userData[message.author.id].strength
                const defence = userData[message.author.id].defence
                const hp = userData[message.author.id].hp
                const maxHP = userData[message.author.id].maxHP
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
                    color: "2f3237"
                })
    
                var xpChart = ['|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|']
    
                const loc = parseInt(10.0 * (xp / xpUntil) + 0.5)
    
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
                embed.addField("Intellect", intellect, true)
    
                embed.addField("Strength", strength, true)
                embed.addField("Defence", defence, true)
                embed.addField("HP", hp + "/" + maxHP, true)
    
                message.channel.send(embed)
            } else if (args[0].startsWith("s")) {
                if (!args[1]) {
                    const personalSettings = userData[message.author.id].account.settings
                    var embed = new discord.MessageEmbed()
                    embed.setTitle("Personal Account Settings:")
                    embed.addField("Rob notifications:", personalSettings.robNotif? "ON":"OFF")
                    embed.addField("Race Win DMs:", personalSettings.raceWinDM? "ON":"OFF")
                    embed.setColor(functions.globalEmbedColor)
                    embed.setFooter((message.guild? guildData[message.guild.id].prefix : "==") + "prof settings help - for help")
                    message.channel.send(embed)
                } else {
                    if (args[1].startsWith("h")) {
                        message.channel.send("**PERSONAL SETTINGS HELP** \n" + 
                        "*" + (message.guild? guildData[message.guild.id].prefix : "==") + "prof settings robnotif* - Toggle Rob notifications (When people rob you you get a DM) \n" + 
                        "*" + (message.guild? guildData[message.guild.id].prefix : "==") + 
                        "prof settings racewindm <on|off>* - Toggle Race Win DMS (Server settings will override this) \n")
                    } else if (args[1] == "robnotif") {
                        if (args[2] == "on") {
                            userData[message.author.id].account.settings.robNotif = true
                            message.channel.send("Successfully turned **Rob Notifications** on.")
                        } else if (args[2] == "off") {
                            userData[message.author.id].account.settings.robNotif = false
                            message.channel.send("Successfully turned **Rob Notifications** off.")
                        } else {
                            message.channel.send("Not a valid setting. **ON** or **OFF**")
                        }
                    } else if (args[1] == "racewindm") {
                        if (args[2] == "on") {
                            userData[message.author.id].account.settings.raceWinDM = true
                            message.channel.send("Successfully turned **Race Win DMs** on.")
                        } else if (args[2] == "off") {
                            userData[message.author.id].account.settings.raceWinDM = false
                            message.channel.send("Successfully turned **Race Win DMs** off.")
                        } else {
                            message.channel.send("Not a valid setting. **ON** or **OFF**")
                        }
                    } else {
                        message.channel.send("Not a valid setting.")
                    }

                    functions.save("./userData.json", userData)
                }
            }
        } else {
            const name = mention.tag
            const cash = userData[mention.id].cash
            const bank = userData[mention.id].bank
            const gems = userData[mention.id].gems
            const type = userData[mention.id].account.title
            const xp = userData[mention.id].xp
            const xpUntil = userData[mention.id].xpUntil
            const level = userData[mention.id].level
            const intellect = userData[mention.id].intellegencePoints
            const strength = userData[mention.id].strength
            const defence = userData[mention.id].defence
            const hp = userData[mention.id].hp
            const maxHP = userData[mention.id].maxHP
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
                color: "2f3237"
            })

            var xpChart = ['|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|']

            const loc = parseInt(10.0 * (xp / xpUntil) + 0.5)

            xpChart[loc] = "**|**"

            embed.addField("Cash", cash, true)
            embed.addField("Bank", bank, true)
            embed.addField("Gems", gems, true)

            embed.addField("Title", type, true)
            embed.addField("Secured?", "Access Denied", true)
            embed.addField("Leaderboard Location", userLocation, true)

            embed.addField("XP", xpChart.join("") + " \n " + xp + "/" + xpUntil, true)
            embed.addField("Level", level, true)
            embed.addField("Intellect", intellect, true)

            embed.addField("Strength", strength, true)
            embed.addField("Defence", defence, true)
            embed.addField("HP", hp + "/" + maxHP, true)

            message.channel.send(embed)
        }
    }
}