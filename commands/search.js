var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const shopData = require("../shop.json")

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'search',
	description: 'Search for things!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['find'],
    cooldown: 60,
	execute(message, args, mention) {
        if (userData[message.author.id].inventory.Magnif == null || userData[message.author.id].inventory.Magnif < 1) {
            message.channel.send("You do realize that you can't exactly search without that special maginfying glass from the shop right?")
            return
        }
        
        userData[message.author.id].inventory.Magnif.uses -= 1
        if (userData[message.author.id].inventory.Magnif.uses < 1) {
            userData[message.author.id].inventory.Magnif.amount -= 1
            userData[message.author.id].inventory.Magnif.uses = shopData.Magnif.uses
        }

        if (userData[message.author.id].cash < 500) {
            message.channel.send("You gotta have at least $500 to search.")
            return
        }

        var locations = ['backyard', 'house', 'trash can', 'basement', 'code', 'math homework', 'authy', 'nowhere', 'everywhere']
        var searchableLocations = []
        for (var i = 0; i < 3; i++) {
            var num = randomNumber(0, locations.length - 1)
            searchableLocations.push(locations[num])
            locations.splice(num, 1)
        }
        message.channel.send("Where would you like to search? You can search from these locations: `" + searchableLocations.join("` , `") + '`')
        const collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
            time: 10000,
            maxMatches: 1
        });
        collector.on('collect', collectorMessage => {
            collector.stop()
            if (searchableLocations.includes(collectorMessage.content.trim().toLowerCase())) {
                var location = collectorMessage.content.trim().toLowerCase()
                var earnings = 0
                if (location == 'backyard') {
                    earnings = randomNumber(3, 20)
                    message.channel.send("You look in your backyard and find $" + earnings + '.')
                } else if (location == 'house') {
                    earnings = randomNumber(-500, -100)
                    message.channel.send("You got caught trying to pry open the obviously unlocked front door and were fined $" + Math.abs(earnings.toString()) + ".")
                } else if (location == 'trash can') {
                    earnings = randomNumber(-2, 10)
                    message.channel.send("You search in the trash can, but you may have dropped some coins. The total is $" + earnings.toString() + ".")
                } else if (location == 'basement') {
                    earnings = randomNumber(20, 50)
                    message.channel.send("You search everywhere in the basement and find $" + earnings.toString() + ".")
                } else if (location == 'code') {
                    earnings = randomNumber(100, 1000)
                    message.channel.send("You search in the source code of BLUBBADOO and give yourself $" + earnings + ".")
                } else if (location == 'math homework') {
                    message.channel.send("WHAT IS 1 + 1 HUH")
                    message.channel.send(`I wonder why you searched in your math homework, but anyway, you found nothing.`)
                } else if (location == 'authy') {
                    if (randomNumber(0, 5) == 4) {
                        message.channel.send("You try to search in your authenticator app, authy, but instead it shoots a lock at your face.")
                        if (userData[message.author.id].inventory['Lock']) {
                            userData[message.author.id].inventory['Lock'].amount += 1
                        } else {
                            userData[message.author.id].inventory['Lock'] = {
                                amount: 1,
                                uses: shopData['Lock'].uses
                            }
                        }
                    } else {
                        message.channel.send("NO. 🔒 It's locked.")
                    }
                } else if (location == 'nowhere') {
                    earnings = 99
                    message.channel.send("You just stand there and suddenly, money falls from the sky and you catch $" + earnings + ".")
                } else if (location == 'everywhere') {
                    earnings = randomNumber(-5, -1)
                    message.channel.send("YOU SCOUR EVERYWHERE, BUT WHOOPS! YOU DROP $" + Math.abs(earnings) + "!")
                } else {
                    message.channel.send(embed("Error", "An error occured while trying to process your request. Please try again.", 'ff0000'))
                    return
                }
                userData[message.author.id].cash += earnings
                fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                return
            } else {
                message.channel.send("You do realize that that's not a choice.")
            }
        })
    }
}