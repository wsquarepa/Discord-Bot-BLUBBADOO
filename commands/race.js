var discord = require('discord.js')
var sentencer = require('sentencer')
var textToPicture = require("text-to-picture")
var userData = require("../userData.json")
var fs = require("fs")

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789'; //Capital I and lowercase l have been removed for readiness purposes.
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

module.exports = {
    name: 'race',
	description: 'Race someone in a typing race!',
    args: true,
    usage: '<@mention>',
    guildOnly: true,
    aliases: [],
    cooldown: 60,
	execute(message, args) {
        var mention = message.mentions.users.first()

        if (mention == null) {
            message.channel.send("Please mention someone next time.")
            return;
        }

        if (mention.id == message.author.id) {
            message.channel.send("What's the point in racing yourself? You'd tie anyway.")
            return
        }

        if (mention.bot) {
            message.channel.send("You do realize that the bot would win, right?")
            return
        }

        if (mention.presence.status == "offline") {
            message.channel.send("I don't think you'd like it if someone tried to race you while you were offline.")
            return
        }

        message.channel.send("Are you ready, <@" + mention.id + ">?")
        const collector = new discord.MessageCollector(message.channel, m => m.author.id == mention.id, {
            time: 10000,
            maxMatches: 1
        });
        collector.on('end', function () {
            message.channel.send("Collect end.")
        })
        collector.on('collect', collectorMessage => {
            collector.stop()
            if (collectorMessage.content.toLowerCase() == "yes") {
                var randomString = sentencer.make("A {{adjective}} {{verb}}")
                var filename = makeid(10)
                textToPicture.convert({
                    text: randomString,
                    ext: 'png',
                    size: 16,
                    width: 30,
                    height: 20,
                    color: "black"
                }).then(function (result) {
                    result.write('./' + filename + '.png')
                    var editMsg = new discord.Message()
                    collectorMessage.channel.send("GET READY").then(m => editMsg = m)
                    setTimeout(function () {
                        editMsg.edit("GET SET")
                        setTimeout(function () {
                            editMsg.edit("GOOOOOOO! \n FIRST TO TYPE THIS WINS: ")
                            message.channel.send("", {
                                files: ['./' + filename + '.png']
                            }).then(msg => editMsg = msg)
                            const raceCollector = new discord.MessageCollector(collectorMessage.channel,
                                m => m.author.id == mention.id || m.author.id == message.author.id, {
                                    time: 20000
                                });
                            raceCollector.on('collect', raceCollectorMsg => {
                                if (raceCollectorMsg.content == randomString) {
                                    raceCollectorMsg.channel.send("CONGRATULATIONS! <@" + raceCollectorMsg.author.id + "> WON THE RACE!!!")
                                    userData[raceCollectorMsg.author.id].cash += 250
                                    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                                    raceCollectorMsg.author.send("You earn $250 for that race against " + mention.username + ". Congratulations!")
                                    editMsg.delete()
                                    raceCollector.stop("Listen end.")
                                    fs.unlink('./' + filename + '.png', function (error) {
                                        if (error) console.error(error)
                                    })
                                } else {
                                    raceCollectorMsg.delete({timeout: 2000})
                                    message.channel.send("Incorrect. Try again.").then(mesgi => mesgi.delete({timeout: 2000}))
                                }
                            })
                        }, 1000)
                    }, 1000)
                })



            } else if (collectorMessage.content.toLowerCase() == "no") {
                collectorMessage.channel.send("Well, that's too bad.");
            } else {
                collectorMessage.channel.send("Enter yes or no next time.")
            }
        })
    }
}