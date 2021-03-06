var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const shopData = require('../shop.json')
const guildData = require('../guildData.json')
const functions = require("../jsHelpers/functions")

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
    category: "economy",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        if (userData[message.author.id].inventory["fishingrod"] == null || userData[message.author.id].inventory["fishingrod"].amount < 1) {
            const embed = new discord.MessageEmbed()
            embed.setTitle("Error")
            embed.setDescription("How do you suppose you fish without a fishingrod?")
            embed.setColor("ff0000")
            message.channel.send(embed)
            return false
        }

        userData[message.author.id].inventory.fishingrod.uses -= 1
        if (userData[message.author.id].inventory.fishingrod.uses < 1) {
            userData[message.author.id].inventory.fishingrod.amount -= 1
            userData[message.author.id].inventory.fishingrod.uses = shopData.fishingrod.uses
        }
        var chance = randomNumber(0, 2)
        if (chance > 0) {
            var earnings = randomNumber(100, 500)
            var embed = new discord.MessageEmbed()
            embed.setTitle("Fish Success!")
            embed.setDescription("GOOD! YOU FISH, SOMETHING TUGS ON YOUR ROD, AND YOU PULL OUT A FISH!!! \n 🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟 \n You sell it for $" + earnings)
            embed.setColor(functions.globalEmbedColor)
            message.channel.send(embed)
            userData[message.author.id].cash += earnings
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
        } else {
            message.channel.send("Uh oh, unfourtunatley no fish wanted you to catch them. Try again in 45 seconds!")
        }
    }
}