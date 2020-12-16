var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'guess',
	description: 'Guess the number between 1 and [range]!',
    args: false,
    usage: '[range=100]',
    guildOnly: false,
    aliases: [''],
    cooldown: 120,
    levelRequirement: 0,
    category: "economy",
    adminOnly: true,
	execute(message, args, mention, specialArgs) {
        var range = 100

        if (args.length) {
            if (!isNaN(parseInt(args[0]))) {
                range = parseInt(args[0])
            }
        }

        if (range < 100) {
            message.channel.send("Minimum range is 100")
            return false
        }

        if (range > 1000) {
            message.channel.send("Maximum range is 1000")
            return false
        }

        if (userData[message.author.id].cash < 10) {
            message.channel.send("Not enough cash to play (You need $10)")
            return false
        }

        const computerNumber = functions.randomNumber(1, range)
        var guessesLeft = 0
        for (var i = range; i > 2; i / 2) {
            guessesLeft++
        }
        guessesLeft++
        
        userData[message.author.id].cash -= 10

        message.channel.send(`I chose a number between 1 and ${range}. You have \`${guessesLeft}\` guesses left. Give it a try!" + 
        " \n To give up say \`cancel\`. You still lose $10. \n You have 1 minute`)
        const collector = new discord.MessageCollector(message.channel, m => m.author == message.author, {time: 60000})
        collector.on('collect', msg => {
            if (msg.content == "cancel") {
                message.channel.send("Cancelled! You lost $10!")
                collector.stop()
                return;
            }

            const guess = parseInt(msg.content)
            if (isNaN(guess)) {
                message.channel.send("Enter a valid number for your guess!")
                return
            }
            
            guessesLeft--

            if (guess > computerNumber) {
                message.channel.send("Guess too high! " + guessesLeft + " chances left!")
                return
            } else if (guess < computerNumber) {
                message.channel.send("Guess too low! " + guessesLeft + " chances left!")
                return
            } else if (guess == computerNumber) {
                userData[message.author.id].cash += 20
                message.channel.send("You got it!")
                collector.stop()
                return
            } else {
                message.channel.send("An error occured... what?")
            }

            if (guessesLeft < 1) {
                message.channel.send("Out of chances! My number was `" + computerNumber + "`! Next time try the `binary search` method!")
                collector.stop()
                return
            }
        })
    }
}