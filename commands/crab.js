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
        if (userData[message.author.id].inventory["Cage"] == null || userData[message.author.id].inventory["Cage"] < 1) {
            message.channel.send(embed("Error", "How do you suppose you crab without a Cage?", "ff0000"))
            return
        }

        userData[message.author.id].inventory.Cage.uses -= 1
        if (userData[message.author.id].inventory.Cage.uses < 1) {
            userData[message.author.id].inventory.Cage.amount -= 1
            userData[message.author.id].inventory.Cage.uses = shopData.Cage.uses
        }

        var msg = new discord.Message()
        message.channel.send("Okie, crabbing...").then(m => msg = m)
        setTimeout(function() {
            var earnings = randomNumber(20, 100)
            msg.edit("GOOD! YOU CRAB, AND A CRAB FALLS FOR YOUR TRAP! \n 🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀")
            message.channel.send("You sell it for $" + earnings)
            userData[message.author.id].cash += earnings
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        }, 3000)
    }
}