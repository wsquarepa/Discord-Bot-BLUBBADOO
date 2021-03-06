var userData = require('../userData.json')
const guildData = require('../guildData.json')
const fs = require('fs');
const discord = require("discord.js")
const shopData = require('../shop.json')
const functions = require("../jsHelpers/functions")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'crab',
    description: 'Crab for crabs!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['cage'],
    cooldown: 45,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        if (userData[message.author.id].inventory["cage"] == null || userData[message.author.id].inventory["cage"].amount < 1) {
            const embed = new discord.MessageEmbed()
            embed.setTitle("Error")
            embed.setDescription("How do you suppose you crab without a cage?")
            embed.setColor("ff0000")
            message.channel.send(embed)
            return false
        }

        userData[message.author.id].inventory.cage.uses -= 1
        if (userData[message.author.id].inventory.cage.uses < 1) {
            userData[message.author.id].inventory.cage.amount -= 1
            userData[message.author.id].inventory.cage.uses = shopData.cage.uses
        }
        var chance = randomNumber(0, 3)
        if (chance > 0) {
            var earnings = randomNumber(50, 400)
            var embed = new discord.MessageEmbed()
            embed.setTitle("Crab Success!")
            embed.setDescription("GOOD! YOU CRAB, AND A CRAB FALLS FOR YOUR TRAP! \n 🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀 \n You sell it for $" + earnings)
            embed.setColor(functions.globalEmbedColor)
            message.channel.send(embed)
            userData[message.author.id].cash += earnings
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
        } else {
            message.channel.send("No crabs fell for your trap.")
        }
    }
}