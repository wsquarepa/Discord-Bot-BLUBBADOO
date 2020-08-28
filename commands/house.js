var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

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
    execute(message, args, mention) {
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
        } else if (args[0] == "buy") {

            if (userData[message.author.id].houses.length == 5) {
                message.channel.send("You have reached the max amount of houses (5).")
                return;
            }

            message.channel.send(`
Three options:
    1: Build house (Materials)
    Requires:
        a: 500 Iron
        b: 500 Wood
        c: 200 String
        d: 250 Glass

    2: Buy house (Cash)
    Requires:
        a: 5 Million dollars

    3: Materialize house (Gems)
    Requires:
        a: 100 Gems
    
Type \`1\`, \`2\`, \`3\` or \`cancel\` into the chat.
            `)

            const collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {
                time: 10000
            })
            var number = 0

            collector.on('collect', (msg) => {
                console.log(msg.content)
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
                        (!userInv["iron"] || userInv["iron"].amount < 500) ||
                        (!userInv["wood"] || userInv["wood"].amount < 500) ||
                        (!userInv["string"] || userInv["string"].amount < 200) ||
                        (!userInv["glass"] || userInv["glass"].amount < 250)
                    ) {
                        message.channel.send("You don't have enough materials to build with.")
                        return;
                    }

                    userInv["iron"].amount -= 500
                    userInv["wood"].amount -= 500
                    userInv["string"].amount -= 200
                    userInv["glass"].amount -= 250

                    userData[message.author.id].houses.push({
                        durability: 1000000,
                        level: 0,
                        xp: 0,
                        xpUntil: 100
                    })
                    message.channel.send("You made a house with materials!")
                } else if (number == 2) {
                    if (userData[message.author.id].cash < 5000000) {
                        message.channel.send("You don't have enough **cash** to buy a house. Try withdrawing all your money!")
                        return;
                    }

                    userData[message.author.id].cash -= 5000000
                    userData[message.author.id].houses.push({
                        durability: 1000000,
                        level: 0,
                        xp: 0,
                        xpUntil: 100
                    })
                    message.channel.send("You bought a house for 5 Million dollars!")
                } else if (number == 3) {
                    if (userData[message.author.id].gems < 100) {
                        message.channel.send("You don't have enough gems to make the house.")
                        return
                    }

                    userData[message.author.id].gems -= 100
                    userData[message.author.id].houses.push({
                        durability: 1000000,
                        level: 0,
                        xp: 0,
                        xpUntil: 100
                    })
                    message.channel.send("You materialized a house with 100 gems!")
                }
            })
        } else if (args[0] == "fix") {
            message.channel.send("Currently, you can only fix it with gems; as well as all of them at a time; " +
                "but later, you can fix it with other things! \n Fix all for **25 GEMS**?")
            const collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {
                time: 10000
            })

            var messageCollected = ""
            collector.on("collect", (msg) => {
                messageCollected = msg.content
                collector.stop()
            })

            collector.on("end", () => {
                if (messageCollected.startsWith("y")) {
                    if (userData[message.author.id].gems < 25) {
                        message.channel.send("You don't have enough gems to fix your house!")
                        return
                    }

                    userData[message.author.id].gems -= 25
                    for (var i = 0; i < userData[message.author.id].houses.length; i++) {
                        userData[message.author.id].houses[i].durability = 1000000
                    }
                    message.channel.send("Fixed all houses for 25 gems.")
                } else {
                    message.channel.send("Welp, that's too bad, maybe another time?")
                }
            })
        }
    }
}