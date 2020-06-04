var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function saveCoins() {
    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
}

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}


module.exports = {
    name: 'pet',
	description: 'Do stuff with your pet!',
    args: false,
    usage: '[command]',
    guildOnly: false,
    aliases: [],
    cooldown: 1,
	execute(message, args) {
        if (isEmpty(userData[message.author.id].pet)) {
            if (userData[message.author.id].gems < 5) {
                message.channel.send("You don't have enough **GEMS** to buy a pet.")
                return
            }

            message.channel.send("Buy a pet for 5 GEMS?")
            var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1})
            collector.on('collect', function(msg) {
                collector.stop()
                if (msg.content.toLowerCase() == "yes") {
                    userData[message.author.id].gems -= 5
                    userData[message.author.id].pet = {
                        food: 500,
                        coins: 0,
                        type: "",
                        name: message.author.username
                    }
                    message.channel.send("You bought a pet for **5 GEMS**")
                    saveCoins()
                } else {
                    message.channel.send("Welp, that's too bad. Come another time!")
                }
            })
        }

        try {
            if (args[0].toLowerCase() == "help") {
                message.channel.send(embed("Help on pets:", `
                    ==pet feed - feed your pet,
                    ==pet collect - collect the money your pet earned you,
                    ==pet name <name> - Name your pet,
                    ==pet type <type> - Change your pet type
                `))
            } else if (args[0] == "feed") {

                if (userData[message.author.id].gems < 1) {
                    message.channel.send("You don't got enough **GEMS**.")
                    return
                }

                if (userData[message.author.id].pet.food > 50) {
                    message.channel.send("Do you **ACTUALLY** want to feed your pet it's at " + (500 - userData[message.author.id].pet.food) + " hunger.")
                }

                message.channel.send("Feed your pet for **1 GEM**?")
                var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1})
                collector.on('collect', function(msg) {
                    collector.stop()
                    if (msg.content.toLowerCase() == "yes") {
                        userData[message.author.id].gems -= 1
                        userData[message.author.id].pet.food = 500
                        message.channel.send("You paid `1 GEM` to feed your pet.")
                        saveCoins()
                    } else {
                        message.channel.send("Welp, that's too bad. Come another time!")
                    }
                })
            } else if (args[0] == "collect") {
                var coinamt = userData[message.author.id].pet.coins
                userData[message.author.id].cash += coinamt
                userData[message.author.id].pet.coins = 0
                message.channel.send("You took $" + coinamt + " from your pet.")
                saveCoins()
            } else if (args[0] == "name") {
                var petName = ""
                if (args[1] == null || args[1] == "") {
                    petName = message.author.username
                } else {
                    petName = args[1]
                }
                userData[message.author.id].pet.name = petName
                message.channel.send("Pet name set to " + petName)
                saveCoins()
            } else if (args[0] == "type") {
                var petType = ""
                if (args[1] == null) {
                    petType = message.author.username
                } else {
                    petType = args[1]
                }
                userData[message.author.id].pet.type = petType
                message.channel.send("Pet type set to " + petType)
                saveCoins()
            }
        } catch (error) {
            console.error(error)
            if (isEmpty(userData[message.author.id].pet)) return
            message.channel.send(embed("Your pet " + userData[message.author.id].pet.type, userData[message.author.id].pet.name + "'s petfile:")
                .addField("Hunger (out of 500)", 500 - userData[message.author.id].pet.food, true)
                .addField("Coins", userData[message.author.id].pet.coins, true))
        }
    }
}