var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'use',
	description: 'Use an item!',
    args: true,
    usage: '<item>',
    guildOnly: false,
    aliases: ['activate'],
    cooldown: 3.3,
	execute(message, args, mention) {
        if (args[0].toLowerCase() == "gem") {

            if (args[1] == null) {
                args[1] = 1
            }
            args[1] = parseInt(Math.round(args[1]))
            
            if (userData[message.author.id].gems < args[1]) {
                message.channel.send("Ya don't got enough gems to do that.")
                return
            }

            message.channel.send("Ok, using " + args[1] + " " + args[0] + (args[1] > 1? "s":"") + " ...")
            userData[message.author.id].gems -= args[1]
            var earnings = randomNumber(1000, 2000) * args[1]
            userData[message.author.id].cash += earnings
            message.channel.send("Congrats, you earned $" + earnings + " from " + (args[1] > 1? "those":"that") + " " + args[0] + (args[1] > 1? "s":"") + ".")
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        } else if (args[0].toLowerCase() == "lock") {

            if (userData[message.author.id].account.secured == true) {
                message.channel.send("Your account is already secured, there's no point re-securing it.")
                return
            }

            if (userData[message.author.id].inventory.lock.amount < 1) {
                message.channel.send("You don't got any locks.")
                return
            }

            message.channel.send("Ok, locking your account...")
            userData[message.author.id].inventory.lock.amount -= 1
            userData[message.author.id].account.secured = true
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            message.channel.send("Ok, account secured!")
        }
    }
}