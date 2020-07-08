var userData = require('../userData.json')
const fs = require('fs');
const shopData = require('../shop.json')
const discord = require("discord.js")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

module.exports = {
    name: 'raid',
	description: 'Raid a village!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 60,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        if (userData[message.author.id].inventory["knife"] == null || userData[message.author.id].inventory["knife"].amount < 1) {
            message.channel.send("How do you suppose you raid without a knife?")
            return false
        }

        userData[message.author.id].inventory.knife.uses -= 1
        if (userData[message.author.id].inventory.knife.uses < 1) {
            userData[message.author.id].inventory.knife.amount -= 1
            userData[message.author.id].inventory.knife.uses = shopData.knife.uses
        }

        var glass = randomNumber(0, 7)
        var string = randomNumber(2, 8)

        if (!glass == 0) {
            if (userData[message.author.id].inventory["glass"]) {
                userData[message.author.id].inventory["glass"].amount += glass
            } else {
                userData[message.author.id].inventory["glass"] = {
                    amount: glass,
                    uses: 1
                }
            }
        }

        if (userData[message.author.id].inventory["string"]) {
            userData[message.author.id].inventory["string"].amount += string
        } else {
            userData[message.author.id].inventory["string"] = {
                amount: string,
                uses: 1
            }
        }

        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)

        message.channel.send(embed("Successfull raid!", `
        **Glass:** ${glass}
        **String:** ${string}
        `, "00ff00"))
    }
}