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
    cooldown: 10,
    levelRequirement: 4,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        if (userData[message.author.id].cash < 10000) {
            message.channel.send("You cannot fight without at least $10000")
            return false;
        }

        if (!mention) {
            const chance = functions.randomNumber(0, 3)
            if (chance == 0) {
                userData[message.author.id].cash += 2500
                message.channel.send("Great! You fought someone and earned $2500!")
                userData[message.author.id].hp -= functions.randomNumber(10, 20)
            } else {
                userData[message.author.id].cash -= 2500
                message.channel.send("Whoopsies! You failed and had to pay $2500")
                userData[message.author.id].hp = functions.randomNumber(10, 20)
            }
        } else {
            if (mention.bot) {
                message.channel.send("Failed fight. **" + mention.tag + "** earned $" + userData[message.author.id].cash + "! \n" +
                    "Just don't fight bots. They always beat you")
                return
            }

            if (!userData[mention.id]) {
                message.channel.send("No account associated with user.")
                return false;
            }

            if (mention.presence.status == "offline") {
                message.channel.send("You can't fight someone offline")
                return false
            }

            if (userData[mention.id].account.type.toLowerCase() == "admin") {
                message.channel.send("To make it fair, you can't fight bot admins as they have indefinate money.")
                return false;
            }

            if (userData[mention.id].cash < 10000) {
                message.channel.send("The person you are fighting has less than $10000, so you cannot fight them.")
                return false;
            }

            if (mention.id == message.author.id) {
                userData[message.author.id].cash -= 25
                message.channel.send("You punch yourself and lose $25")
                return false
            }

            if (userData[message.author.id].hp < 31) {
                message.channel.send("You don't have enough HP to fight.")
                return false;
            }

            if (userData[mention.id].hp < 31) {
                message.channel.send("They don't have enough HP to fight.")
                return false;
            }

            message.channel.send(mention.tag + ", do you want to fight " + message.author.tag + "?")
            const collector = new discord.MessageCollector(message.channel, x => x.author.id == mention.id, {
                time: 10000
            })
            var choice = "n"
            collector.on('collect', (msg) => {
                choice = msg.content.charAt(0)
                collector.stop()
            })

            collector.on('end', () => {
                if (choice == "n") {
                    message.channel.send("That's too bad.")
                    return
                }

                const userStrength = userData[message.author.id].strength
                const userDefence = userData[message.author.id].defence
                const userHp = userData[message.author.id].hp
                const mentionStrength = userData[mention.id].strength
                const mentionDefence = userData[mention.id].defence
                const mentionHp = userData[mention.id].hp

                if (userStrength - mentionDefence > mentionStrength - userDefence) {
                    userData[message.author.id].cash += 5000
                    userData[mention.id].cash -= 5000
                    userData[message.author.id].hp -= functions.randomNumber(20, 30)
                    userData[mention.id].hp = functions.randomNumber(1, 3)
                    message.channel.send("Congratulations! **" + message.author.tag + "** earned $5000!")
                } else if (userStrength - mentionDefence < mentionStrength - userDefence) {
                    userData[message.author.id].cash -= 5000
                    userData[mention.id].cash += 5000
                    userData[message.author.id].hp = functions.randomNumber(1, 3)
                    userData[mention.id].hp -= functions.randomNumber(20, 30)
                    message.channel.send("Congratulations! **" + mention.tag + "** earned $5000!")
                } else {
                    if (userHp > mentionHp) {
                        userData[message.author.id].cash += 5000
                        userData[mention.id].cash -= 5000
                        userData[message.author.id].hp -= functions.randomNumber(20, 30)
                        userData[mention.id].hp = functions.randomNumber(1, 3)
                        message.channel.send("Congratulations! **" + message.author.tag + "** earned $5000!")
                    } else {
                        userData[message.author.id].cash -= 5000
                        userData[mention.id].cash += 5000
                        userData[message.author.id].hp = functions.randomNumber(1, 3)
                        userData[mention.id].hp -= functions.randomNumber(20, 30)
                        message.channel.send("Congratulations! **" + mention.tag + "** earned $5000!")
                    }
                }
            })
        }

        functions.save("./userData.json", userData)
    }
}