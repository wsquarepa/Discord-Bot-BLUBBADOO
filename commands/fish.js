var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const shopData = require('../shop.json')

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
    name: 'fish',
	description: 'Fish for fish!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['rod'],
    cooldown: 45,
	execute(message, args, mention) {
        if (userData[message.author.id].inventory["fishingrod"] == null || userData[message.author.id].inventory["fishingrod"].amount < 1) {
            message.channel.send(embed("Error", "How do you suppose you fish without a fishingrod?", "ff0000"))
            return false
        }

        userData[message.author.id].inventory.fishingrod.uses -= 1
        if (userData[message.author.id].inventory.fishingrod.uses < 1) {
            userData[message.author.id].inventory.fishingrod.amount -= 1
            userData[message.author.id].inventory.fishingrod.uses = shopData.fishingrod.uses
        }
        var timeoutkey = 0
        var msg = new discord.Message()
        message.channel.send("Okie, fishing...").then(m => msg = m)
        var chance = randomNumber(0, 2)
        var collector = new discord.MessageCollector(message.channel, m => m.author == message.author && message.content.startsWith("=="))
        collector.on("collect", function() {
            msg.edit("You can't multitask.")
            collector.stop()
            chance = 0
            clearTimeout(timeoutkey)
            return;
        })
        timeoutkey = setTimeout(function() {
            collector.stop()
            if (chance > 0) {
                var earnings = randomNumber(20, 100)
                msg.edit("GOOD! YOU FISH, SOMETHING TUGS ON YOUR ROD, AND YOU PULL OUT A FIIIISH!!! \n 🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟 \n You sell it for $" + earnings)
                userData[message.author.id].cash += earnings
                fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            } else {
                msg.edit("Uh oh, unfourtunatley no fish wanted you to catch them. Try again in approx 42 seconds!")
            }
        }, 3000)
    }
}