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
    name: 'crab',
	description: 'Crab for crabs!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['cage'],
    cooldown: 45,
	execute(message, args, mention) {
        if (userData[message.author.id].inventory["cage"] == null || userData[message.author.id].inventory["cage"].amount < 1) {
            message.channel.send(embed("Error", "How do you suppose you crab without a cage?", "ff0000"))
            return false
        }

        userData[message.author.id].inventory.cage.uses -= 1
        if (userData[message.author.id].inventory.cage.uses < 1) {
            userData[message.author.id].inventory.cage.amount -= 1
            userData[message.author.id].inventory.cage.uses = shopData.cage.uses
        }
        var timeoutkey = 0
        var msg = new discord.Message()
        message.channel.send("Okie, crabbing...").then(m => msg = m)
        var chance = randomNumber(0, 3)
        var collector = new discord.MessageCollector(message.channel, m => m.author == message.author && message.content.startsWith("==") && m.content != "==fish")
        collector.on("collect", function() {
            message.channel.send("You can't multitask.")
            collector.stop()
            chance = 0
            clearTimeout(timeoutkey)
            return;
        })
        timeoutkey = setTimeout(function() {
            collector.stop()
            if (chance > 0) {
                var earnings = randomNumber(20, 100)
                msg.edit("GOOD! YOU CRAB, AND A CRAB FALLS FOR YOUR TRAP! \n 🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀 \n You sell it for $" + earnings)
                userData[message.author.id].cash += earnings
                fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            } else {
                msg.edit("No crabs fell for your trap.")
            }
            
        }, 3000)
    }
}