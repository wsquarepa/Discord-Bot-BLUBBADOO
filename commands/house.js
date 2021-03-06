var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = {
    name: 'house',
    description: 'Buy a house or see the houses you own!',
    args: false,
    usage: '[buy | fix]',
    guildOnly: false,
    aliases: ['home', 'houses', 'homes'],
    cooldown: 2,
    levelRequirement: 10,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        if (!args.length) {
            const embed = new discord.MessageEmbed()
                .setTitle("Your houses:")

            const userHouses = userData[message.author.id].houses
            if (isEmpty(userHouses)) {
                embed.setDescription("You have none!")
                embed.setColor("2f3237")
                message.channel.send(embed)
                return;
            }

            const keys = Object.keys(userHouses)
            for (var i = 0; i < keys.length; i++) {

                const xp = userHouses[keys[i]].xp
                const xpUntil = userHouses[keys[i]].xpUntil

                var xpChart = ['|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|']

                var loc = parseInt(10.0 * (xp / xpUntil) + 0.5)

                xpChart[loc] = "**|**"

                embed.addField("House " + (i + 1) + ":", `
                    Health: ${userHouses[keys[i]].durability}
                    XP: ${xpChart.join("") + " " + xp + "/" + xpUntil}
                    Level: ${userHouses[keys[i]].level}
                `)
            }
            embed.setColor("2f3237")
            message.channel.send(embed)

            if (keys.length == 5) {
                functions.giveAchivement(message, "Realtor")
            }
        } else if (args[0] == "buy") {

            if (userData[message.author.id].houses.length == 5) {
                message.channel.send("You have reached the max amount of houses (5).")
                return;
            }

            message.channel.send(`
Three options:
    1: Build house (Materials)
    Requires:
        a: 2.5K Iron
        b: 3K Wood
        c: 750 String
        d: 500 Glass

    2: Buy house (Cash)
    Requires:
        a: $${10000000 * (userData[message.author.id].houses.length + 1)} blubbadoo bux

    3: Materialize house (Gems)
    Requires:
        a: 250 Gems
    
Type \`1\`, \`2\`, \`3\` or \`cancel\` into the chat.
            `)

            const collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {
                time: 10000
            })
            var number = 0

            collector.on('collect', (msg) => {
                console.log("[SHARD/DEBUG] " + msg.content)
                if (parseInt(msg.content)) {
                    number = parseInt(msg.content)
                }
                collector.stop()
            })

            collector.on('end', () => {
                if (number == 0) {
                    message.channel.send("Welp, that's too bad. Maybe next time?")
                } else if (number == 1) {
                    const userInv = userData[message.author.id].inventory

                    if (
                        (!userInv["iron"] || userInv["iron"].amount < 2500) ||
                        (!userInv["wood"] || userInv["wood"].amount < 3000) ||
                        (!userInv["string"] || userInv["string"].amount < 750) ||
                        (!userInv["glass"] || userInv["glass"].amount < 500)
                    ) {
                        message.channel.send("You don't have enough materials to build with.")
                        return;
                    }

                    userInv["iron"].amount -= 2500
                    userInv["wood"].amount -= 3000
                    userInv["string"].amount -= 750
                    userInv["glass"].amount -= 500

                    userData[message.author.id].houses.push({
                        durability: 1000000,
                        level: 0,
                        xp: 0,
                        xpUntil: 100
                    })
                    message.channel.send("You made a house with materials!")
                } else if (number == 2) {
                    if (userData[message.author.id].cash < (10000000 * (userData[message.author.id].houses.length + 1))) {
                        message.channel.send("You don't have enough **cash** to buy a house. Try withdrawing all your money!")
                        return;
                    }

                    userData[message.author.id].cash -= (10000000 * (userData[message.author.id].houses.length + 1))
                    userData[message.author.id].houses.push({
                        durability: 1000000,
                        level: 0,
                        xp: 0,
                        xpUntil: 100
                    })
                    message.channel.send("You bought a house for " + (10000000 * (userData[message.author.id].houses.length)) + " dollars!")
                } else if (number == 3) {
                    if (userData[message.author.id].gems < 250) {
                        message.channel.send("You don't have enough gems to make the house.")
                        return
                    }

                    userData[message.author.id].gems -= 250
                    userData[message.author.id].houses.push({
                        durability: 1000000,
                        level: 0,
                        xp: 0,
                        xpUntil: 100
                    })
                    message.channel.send("You materialized a house with 250 gems!")
                }
            })
        } else if (args[0] == "fix") {
            message.channel.send("Which house to fix? Type in house number (e.g. 1)")
            var collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {
                time: 10000
            })

            var messageCollected = ""
            var stage = 1
            collector.on("collect", (msg) => {
                messageCollected = msg.content
                collector.stop()
            })

            collector.on("end", () => {
                if (stage == 1) {
                    if (!userData[message.author.id].houses[parseInt(messageCollected)]) {
                        message.channel.send("Not a valid house id.")
                        return;
                    }

                    message.channel.send("Pay **25 gems** to fix house?")
                    collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {
                        time: 10000
                    })
                } else {
                    if (messageCollected.startsWith("y")) {
                        if (userData[message.author.id].gems < 25) {
                            message.channel.send("You don't have enough gems to fix your house!")
                            return
                        }

                        userData[message.author.id].gems -= 25
                        for (var i = 0; i < userData[message.author.id].houses.length; i++) {
                            userData[message.author.id].houses[i].durability = 1000000
                        }
                        message.channel.send("Fixed house for 25 gems.")
                    } else {
                        message.channel.send("Welp, that's too bad, maybe another time?")
                    }
                }
            })
        }
    }
}