var discord = require('discord.js')
var userData = require("../userData.json")
var fs = require("fs")
var sentencer = require('sentencer')
const functions = require("../jsHelpers/functions")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'phrase',
    description: 'Play the PHRASE game with your friends!',
    args: false,
    usage: '',
    guildOnly: true,
    aliases: [],
    cooldown: 60,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        message.channel.send("For the people who are here, if anyone wants to play PHRASE GUESSER with <@" + message.author.id + ">, then say 'Join' within the next " +
            "10 seconds.")
        const collector = new discord.MessageCollector(message.channel, m => m.author.id != message.author.id && !m.author.bot, {
            time: 10000
        });
        var players = [message.author.id]
        collector.on('collect', collectorMessage => {


            if (collectorMessage.content.toLowerCase() == "join") {
                if (players.includes(collectorMessage.author.id)) {
                    message.channel.send("You already joined.")
                } else {
                    players.push(collectorMessage.author.id)
                    collectorMessage.reply("Joined!")
                }

            }
        })
        collector.on('end', function () {
            if (players.length == 1) {
                message.channel.send("Not enough people joined.")
                return false
            }
            message.channel.send("Ok. " + players.length.toString() + " players joined.").then(function () {
                message.channel.send("So, the point of this game is to guess the sentence first, and the first to guess it earns $250 in their cash! \n" +
                    "You get `1 minute 30 seconds` to guess the sentence.").then(function () {
                    setTimeout(function () {
                        var msg = new discord.Message()
                        message.channel.send("GET READY").then(m => msg = m)
                        setTimeout(function () {
                            msg.edit("GET SET")
                            setTimeout(function () {
                                msg.edit("GOOOOOOO")
                                var sentence = sentencer.make("{{an_adjective}} {{noun}}")
                                console.log(sentence)
                                var revealed = []
                                var sentenceList = sentence.split("")
                                for (var i = 0; i < sentence.length; i++) {
                                    revealed.push("\\_")
                                }
                                var usedNumbers = []
                                var number = randomNumber(0, sentenceList.length - 1)
                                usedNumbers.push(number)
                                revealed[number] = sentenceList[number]
                                message.channel.send(revealed.toString().split(",").join(" ")).then(m => msg = m)
                                const guessCollect = new discord.MessageCollector(message.channel, m => players.includes(m.author.id), {
                                    time: 90000
                                });

                                var changer = setInterval(function() {
                                    number = randomNumber(0, sentenceList.length - 1)
                                    while (usedNumbers.includes(number) && usedNumbers.length == sentenceList.length - 1) {
                                        number = randomNumber(0, sentenceList.length - 1)
                                    }
                                    usedNumbers.push(number)
                                    revealed[number] = sentenceList[number]
                                    msg.edit(revealed.toString().split(",").join(" "))
                                }, 500)

                                guessCollect.on('collect', function (messageCollected) {
                                    if (messageCollected.content == sentence) {
                                        messageCollected.channel.send("CONGRATULATIONS! <@" + messageCollected.author.id + "> GUESSED THE PHRASE!")
                                        userData[messageCollected.author.id].cash += 250
                                        functions.giveAchivement(messageCollected, "Sentencer")
                                        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                                        guessCollect.stop("Game end")
                                        clearInterval(changer)
                                    } else {
                                        //pass
                                    }
                                })

                                guessCollect.on('end', function (messagesCollected) {
                                    message.channel.send("GAME ENDED. IT WAS `" + sentence.toString().split(",").join(" ") + "`")
                                    clearInterval(changer)
                                    message.channel.bulkDelete(messagesCollected)
                                })
                            }, 1000)
                        }, 2000)
                    }, 1000)
                })
            })
        })
    }
}