var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const guildData = require('../guildData.json')
const functions = require("../jsHelpers/functions")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

module.exports = {
    name: 'explore',
    description: 'Explore for goods!',
    args: false,
    usage: '',
    guildOnly: true,
    aliases: ['find'],
    cooldown: 60,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        if (userData[message.author.id].inventory["map"] == null || userData[message.author.id].inventory["map"].amount < 1) {
            message.channel.send(embed("Error", "You can't explore without a map; you'll get lost.", "ff0000"))
            return false
        }

        userData[message.author.id].inventory["map"].amount--

        var timeout = 0
        var chance = randomNumber(0, 5)

        message.channel.send("Exploring... Please wait...").then(msg => {
            var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id && m.content.startsWith(guildData[message.guild.id].prefix))

            collector.on("collect", function () {
                collector.stop()
                clearTimeout(timeout)
                msg.edit("You can't do anything while you're exploring.")
                chance = 0
                return;
            })

            timeout = setTimeout(function () {
                collector.stop()
                if (chance == 3) {
                    msg.edit("Hmm... what's that shiny thingy? OH WAIT ITS A TREASURE CHEST WOOOOOOOOOO!!!! It's in your inventory now; do `" + guildData[message.guild.id].prefix +
                        "use chest` to open it!")
                    functions.giveAchivement(message, "The explorer")
                    if (userData[message.author.id].inventory["chest"]) {
                        userData[message.author.id].inventory["chest"].amount += 1
                    } else {
                        userData[message.author.id].inventory["chest"] = {
                            amount: 1,
                            uses: 1
                        }
                    }

                    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[ERROR/SHARD] " + err) : null)
                } else {
                    msg.edit("Hmm... what's that shiny thing? Great, it's just another puddle of water.")
                }
            }, 5000)
        })


    }
}