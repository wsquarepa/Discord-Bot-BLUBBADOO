var userData = require('../userData.json')
const discord = require('discord.js')
const fs = require('fs');

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'rps',
    description: 'Play rock paper scissors with the bot!',
    args: true,
    usage: '<bet>',
    guildOnly: false,
    aliases: [],
    cooldown: 60,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        var options = ["rock", "paper", "scissors"]
        if (isNaN(parseInt(args[0]))) {
            message.channel.send("Next time, tell me what you want to bet.")
            return false
        }
        if ((userData[message.author.id].cash - parseInt(args[0])) < 0) {
            message.channel.send("You can't bet more than you have on hand.")
            return false
        }
        message.channel.send("Choose `rock`, `paper` or `scissors`.")
        const collector = new discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 10000,
            maxMatches: 1
        });
        collector.on('collect', message => {
            collector.stop("Collect end")
            if (!options.includes(message.content.toLowerCase())) {
                message.channel.send("Option not recognised, try again.")
                return false
            }
            var compOpt = options[randomNumber(1, 3) - 1]
            message.channel.send("I choose " + compOpt + ".")
            var messageContent = message.content.toLowerCase()
            var win = undefined
            if (compOpt == "rock") {
                if (message.content.toLowerCase() == "paper") {
                    message.channel.send("WhyYyYyyyyYYYYyyyY I lose")
                    win = true
                } else if (messageContent == "scissors") {
                    message.channel.send("Yay I win")
                    win = false
                } else {
                    message.channel.send("Why is it a TIE")
                }
            } else if (compOpt == "paper") {
                if (message.content.toLowerCase() == "scissors") {
                    message.channel.send("WhyYyYyyyyYYYYyyyY I lose")
                    win = true
                } else if (messageContent == "rock") {
                    message.channel.send("Yay I win")
                    win = false
                } else {
                    message.channel.send("Why is it a TIE")
                }
            } else {
                if (message.content.toLowerCase() == "rock") {
                    message.channel.send("WhyYyYyyyyYYYYyyyY I lose")
                    win = true
                } else if (messageContent == "paper") {
                    message.channel.send("Yay I win")
                    win = false
                } else {
                    message.channel.send("Why is it a TIE")
                }
            }

            if (win !== undefined) {
                if (win) {
                    var earnings = parseInt(args[0])
                    userData[message.author.id].cash += earnings
                } else {
                    var losings = parseInt(args[0])
                    userData[message.author.id].cash -= losings
                }
            }

            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
        })
    }
}