var userData = require('../userData.json')
const discord = require('discord.js')
const fs = require('fs');

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'math',
	description: 'Do math!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['muff'],
    cooldown: 40,
	execute(message, args, mention) {
        if ((userData[message.author.id].cash - 100) < 0) {
            message.channel.send("You can't play this game without at least $100 in cash.")
            return false
        }

        var number1 = randomNumber(1, 100)
        var number2 = randomNumber(1, 100)
        message.channel.send("What is " + number1 + " + " + number2 + "?")
        const collector = new discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 10000,
            maxMatches: 1
        });
        collector.on('collect', message => {
            collector.stop()
            try {
                parseInt(message.content)
            } catch {
                message.channel.send("Enter a number.");
                return false
            }

            if (parseInt(message.content) == NaN) {
                message.channel.send("Enter a number.");
                return false
            }

            if (parseInt(message) == (number1 + number2)) {
                message.channel.send("Correct!")
                var earnings = 100
                userData[message.author.id].cash += earnings
            } else {
                message.channel.send("WRONG!")
                var losings = 100
                userData[message.author.id].cash -= losings
            }

            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        })
        collector.on('end', function(collectMsgs) {
            if (collectMsgs.size < 1) {
                message.channel.send("You were too slow to answer.")
            }
        })
    }
}