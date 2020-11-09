var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'guess',
	description: 'Guess the number between 1 and 100!',
    args: false,
    usage: '<bet>',
    guildOnly: false,
    aliases: [''],
    cooldown: 45,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        if (!args.length) {
            message.channel.send("Please provide a bet.")
            return false
        }

        const bet = parseInt(args[0])

        if (isNaN(bet)) {
            message.channel.send("Bet is not a number.")
            return false
        }

        if (bet < 100) {
            message.channel.send("Minimum bet amount is $100")
            return false
        }

        if (bet > 1000) {
            message.channel.send("Maximum bet amount is $1000")
            return false
        }

        if (userData[message.author.id].cash < bet) {
            message.channel.send("Not enough cash for bet. (Your bet is too high!)")
            return false
        }

        const computerNumber = functions.randomNumber(1, 100)
        var guessesLeft = 7
        
        userData[message.author.id].cash -= bet

        message.channel.send("I chose a number between 1 and 100. You have `7` guesses left. Give it a try!" + 
        " \n To give up say `cancel`. You still lose your bet. \n You have 1 minute")
        const collector = new discord.MessageCollector(message.channel, m => m.author == message.author, {time: 60000})
        collector.on('collect', msg => {
            if (msg.content == "cancel") {
                message.channel.send("Cancelled! You lost $" + bet + "!")
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
                userData[message.author.id].cash += bet * 2
                message.channel.send("You got it!")
                collector.stop()
                return
            } else if (guessesLeft < 1) {
                
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