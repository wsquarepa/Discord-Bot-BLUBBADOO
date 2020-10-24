var userData = require('../userData.json')
const discord = require('discord.js')
const fs = require('fs');
const functions = require("../jsHelpers/functions")
const impQuestions = require("../mathquestions.json")

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
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        if (args.length) {
            if (args[0] == "impossible") {
                if (userData[message.author.id].cash < 1000) {
                    message.channel.send("You can't play this game without at least $1000 in cash.")
                    return false
                }

                const keys = Object.keys(impQuestions)
                const question = keys[functions.randomNumber(0, keys.length - 1)]

                message.channel.send("What is " + question + "?")
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
    
                    if (isNaN(parseInt(message.content))) {
                        message.channel.send("Enter a number.");
                        return false
                    }
    
                    if (parseInt(message) == impQuestions[question]) {
                        message.channel.send("So... hate to break it to you... wait sorry **YOU GOT IT RIGHT**!!!")
                        var earnings = 1000000
                        userData[message.author.id].bank += earnings
                        functions.giveAchivement(message, "The guesser")
                    } else {
                        message.channel.send("WRONG! I told you it was impossible! \n The answer is " + impQuestions[question] + ". \n Promise, the question's answer doesn't change. Ever.")
                        var losings = 1000
                        userData[message.author.id].cash -= losings
                    }
    
                    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                })
                collector.on('end', function (collectMsgs) {
                    if (collectMsgs.size < 1) {
                        message.channel.send("You were too slow to answer.")
                    }
                })
            }
        } else {
            if (userData[message.author.id].cash < 100) {
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

                if (isNaN(parseInt(message.content))) {
                    message.channel.send("Enter a number.");
                    return false
                }

                if (parseInt(message) == (number1 + number2)) {
                    message.channel.send("Correct!")
                    var earnings = 100
                    userData[message.author.id].cash += earnings
                    functions.giveAchivement(message, "MUFF")
                } else {
                    message.channel.send("WRONG!")
                    var losings = 100
                    userData[message.author.id].cash -= losings
                }

                fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            })
            collector.on('end', function (collectMsgs) {
                if (collectMsgs.size < 1) {
                    message.channel.send("You were too slow to answer.")
                }
            })
        }
    }
}