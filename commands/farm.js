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

module.exports = {
    name: 'farm',
    description: 'Farm for carrots!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['harvest'],
    cooldown: 60,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        var earnings = randomNumber(30, 100)
        if (userData[message.author.id].inventory["carrot"]) {
            userData[message.author.id].inventory["carrot"].amount += earnings
        } else {
            userData[message.author.id].inventory["carrot"] = {
                amount: earnings,
                uses: 1
            }
        }

        const hoes = {
            wooden: "788834848038846545",
            stone: "788834848244629514",
            iron: "788834847997165650",
            gold: "788834848201769031",
            diamond: "788834848386973716",
            netherite: "788841905772429354"
        }

        const chance = functions.randomNumber(1, 100)
        var hoeChosen = ""
        if (chance == 100) {
            hoeChosen = hoes.netherite
        } else if (chance < 100 && chance > 95) {
            hoeChosen = hoes.diamond
        } else if (chance <= 95 && chance > 85) {
            hoeChosen = hoes.gold
        } else if (chance <= 85 && chance > 70) {
            hoeChosen = hoes.iron
        } else if (chance <= 70 && chance > 50) {
            hoeChosen = hoes.stone
        } else {
            hoeChosen = hoes.wooden
        }

        if (hoeChosen == "788841905772429354") {
            functions.giveAchivement("Serious Dedication")
        }

        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
        message.channel.send(functions.emoji(hoeChosen, message) + " You harvested " + earnings + " carrots. Sell all of them using `" +
            (message.guild ? guildData[message.guild.id].prefix : "==") + "sell carrot all`!")
    }
}