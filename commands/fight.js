var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'fight',
    description: 'Fight someone else or nobody!',
    args: false,
    usage: '[@mention]',
    guildOnly: false,
    aliases: [],
    cooldown: 60,
    levelRequirement: 4,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        if (!mention) {
            const chance = functions.randomNumber(0, 3)
            if (chance == 0) {
                userData[message.author.id].cash += 2500
                message.channel.send("Great! You fought someone and earned $2500!")
            } else {
                userData[message.author.id].cash -= 2500
                message.channel.send("Whoopsies! You failed and had to pay $2500")
            }
        } else {
            if (mention.bot) {
                message.channel.send("Failed fight. **" + mention.tag + "** earned $" + userData[message.author.id].cash + "! \n" + 
                "Just don't fight bots. They always beat you")
                return
            }

            if (mention.presence.status == "offline") {
                message.channel.send("You can't fight someone offline")
                return false
            }

            if (mention.id == message.author.id) {
                userData[message.author.id].cash -= 25
                message.channel.send("You punch yourself and lose $25")
                return false
            }

            message.channel.send("<@" + mention.id + ">, do you want to fight " + message.author.tag + "?")
            const collector = new discord.MessageCollector(message.channel, x => x.author.id == mention.id, {
                time: 10000
            })
            var choice = "n"
            collector.on('collect', (msg) => {
                choice = msg.content.slice(0, 1)
                collector.stop()
            })

            collector.on('end', () => {
                if (choice = "n") {
                    message.channel.send("That's too bad.")
                    return
                }

                const userStrength = userData[message.author.id].strength
                const userDefence = userData[message.author.id].defence
                const userMaxHP = userData[message.author.id].maxHP
                const mentionStrength = userData[mention.id].strength
                const mentionDefence = userData[mention.id].defence
                const mentionMaxHP = userData[mention.id].maxHP

                if (userStrength - mentionDefence > mentionStrength - userDefence) {
                    userData[message.author.id].cash += 5000
                    userData[mention.id].cash -= 5000
                    message.channel.send("Successfull fight! **" + message.author.tag + "** earned $5000!")
                } else if (userStrength - mentionDefence < mentionStrength - userDefence) {
                    userData[message.author.id].cash -= 5000
                    userData[mention.id].cash += 5000
                    message.channel.send("Failed fight. **" + mention.tag + "** earned $5000!")
                } else {
                    if (userMaxHP > mentionMaxHP) {
                        userData[message.author.id].cash += 5000
                        userData[mention.id].cash -= 5000
                        message.channel.send("Successfull fight! **" + message.author.tag + "** earned $5000!")
                    } else {
                        userData[message.author.id].cash -= 5000
                        userData[mention.id].cash += 5000
                        message.channel.send("Failed fight. **" + mention.tag + "** earned $5000!")
                    }
                }
            })
        }

        functions.save("./userData.json", userData)
    }
}