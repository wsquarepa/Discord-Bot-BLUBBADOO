var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

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
	execute(message, args) {
        if (userData[message.author.id].inventory["Fishingrod"] == null || userData[message.author.id].inventory["Fishingrod"] < 1) {
            message.channel.send(embed("Error", "How do you suppose you fish without a Fishingrod?", "ff0000"))
            return
        }

        userData[message.author.id].inventory.Fishingrod.uses -= 1
        if (userData[message.author.id].inventory.Fishingrod.uses < 1) {
            userData[message.author.id].inventory.Fishingrod.amount -= 1
            userData[message.author.id].inventory.Fishingrod.uses = shopData.Fishingrod.uses
        }

        var msg = new discord.Message()
        message.channel.send("Okie, fishing...").then(m => msg = m)
        setTimeout(function() {
            var earnings = randomNumber(20, 100)
            msg.edit("GOOD! YOU FISH, SOMETHING TUGS ON YOUR ROD, AND YOU PULL OUT A FIIIISH!!! \n 🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟")
            message.channel.send("You sell it for $" + earnings)
            userData[message.author.id].cash += earnings
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        }, 3000)
    }
}