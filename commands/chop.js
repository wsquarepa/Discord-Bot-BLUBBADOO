var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const shopData = require('../shop.json')

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'chop',
	description: 'Chop trees!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 60,
	execute(message, args, mention) {
        if (userData[message.author.id].inventory["axe"] == null || userData[message.author.id].inventory["axe"].amount < 1) {
            var embed = new discord.MessageEmbed({
                title: "Error",
                description: "How do you suppose you chop a tree with your fists? It's not minecraft you know...",
                color: "ff0000"
            })
            message.channel.send(embed)
            return false
        }

        userData[message.author.id].inventory.axe.uses -= 1
        if (userData[message.author.id].inventory.axe.uses < 1) {
            userData[message.author.id].inventory.axe.amount -= 1
            userData[message.author.id].inventory.axe.uses = shopData.axe.uses
        }

        var wood = randomNumber(2, 10)

        if (userData[message.author.id].inventory["wood"]) {
            userData[message.author.id].inventory["wood"].amount += wood
        } else {
            userData[message.author.id].inventory["wood"] = {
                amount: wood,
                uses: 1
            }
        }

        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)

        message.channel.send("You got " + wood + " pieces of wood from that tree.")
    }
}