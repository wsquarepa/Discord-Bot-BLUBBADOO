const fs = require('fs');
var userData = require('../userData.json')
const discord = require('discord.js')
const shopData = require('../shop.json')

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
    name: 'coin',
	description: 'Flip your coin',
    args: true,
    usage: '<heads | tails> <bet>',
    guildOnly: false,
    aliases: ['coinFlip'],
    cooldown: 70,
    levelRequirement: 4,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        if (userData[message.author.id].inventory["coin"] == null || userData[message.author.id].inventory["coin"].amount < 1) {
            var embed = new discord.MessageEmbed({
                title: "Error",
                description: "How do you suppose you filp a coin without a coin?",
                color: "ff0000"
            })
            message.channel.send(embed)
            return false
        }

        if (args[0] == null || args[0] != "heads" && args[0] != "tails") {
            message.channel.send("Enter heads or tails next time.")
            return false
        }

        args[1] = parseInt(args[1])
        if (!args[1]) {
            message.channel.send("You gotta bet **SOMETHING**")
            return false
        }

        if (isNaN(args[1])) {
            message.channel.send("I'm not sure how you're going to bet that.")
            return false
        }

        var bet = args[1]

        if (bet > userData[message.author.id].cash) {
            message.channel.send("Hey, you can't bet more than you have on hand.")
            return false
        }

        if (args[1] < 1) {
            message.channel.send("Uhh not sure how you're gonna do that...")
            return false
        } 

        userData[message.author.id].inventory.coin.uses -= 1
        if (userData[message.author.id].inventory.coin.uses < 1) {
            userData[message.author.id].inventory.coin.amount -= 1
            userData[message.author.id].inventory.coin.uses = shopData.coin.uses
        }

        var randNumber = randomNumber(0, userData[message.author.id].cash - 1)
        var win = false
        if (randNumber > bet) {
            win = true
        }

        var otherPossibility = ""
        if (args[0] == "heads") {
            otherPossibility = "tails"
        } else {
            otherPossibility = "heads"
        }

        if (win) {
            userData[message.author.id].cash += args[1]
            message.channel.send("Congrats, you won. It flipped " + args[0])
        } else {
            userData[message.author.id].cash -= args[1]
            message.channel.send("Spectacular! You **LOST**! It flipped " + otherPossibility)
        }
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
    }
}