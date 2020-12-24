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
    execute(message, args, mention, specialArgs) {
        var numberList = []
        var hundreds = 0
        for (var i = 0; i < 100; i++) {
            const chosenNumber = functions.randomNumber(0, 100)
            numberList.push(chosenNumber)
            if (chosenNumber == 100) {
                hundreds++
            }
        }
        const chance = functions.randomNumber(0, numberList.length - 1)
        var amount = numberList[chance]

        if (specialArgs.includes("f")) {
            //force
            amount = 100
        }

        if (specialArgs.includes("fa")) {
            //force advancement
            amount = 0
        }

        const hoes = {
            wooden: "788834848038846545",
            stone: "788834848244629514",
            iron: "788834847997165650",
            gold: "788834848201769031",
            diamond: "788834848386973716",
            netherite: "788841905772429354",
            multicolor: "788842287773253704"
        }

        var hoeChosen = ""
        if (amount == 100) {
            hoeChosen = hoes.netherite
        } else if (amount < 100 && amount > 95) {
            hoeChosen = hoes.diamond
        } else if (amount <= 95 && amount > 85) {
            hoeChosen = hoes.gold
        } else if (amount <= 85 && amount > 70) {
            hoeChosen = hoes.iron
        } else if (amount <= 70 && amount > 50) {
            hoeChosen = hoes.stone
        } else if (amount <= 50 && amount > 0) {
            hoeChosen = hoes.wooden
        } else {
            hoeChosen = hoes.multicolor
            amount = 1000
        }

        if (userData[message.author.id].inventory["carrot"]) {
            userData[message.author.id].inventory["carrot"].amount += amount
        } else {
            userData[message.author.id].inventory["carrot"] = {
                amount: amount,
                uses: 1
            }
        }

        console.log("[SHARD/DEBUG] " + message.author.tag + "'s chance for hoes: " + amount)

        if (hoeChosen == "788841905772429354") {
            functions.giveAchivement(message, "Serious Dedication")
        }

        if (hoeChosen == "788842287773253704") {
            functions.giveAchivement(message, "CARROTS!!!")
        }

        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
        message.channel.send(functions.emoji(hoeChosen, message) + " You harvested " + amount + " carrots. Sell all of them using `" +
            (message.guild ? guildData[message.guild.id].prefix : "==") + "sell carrot all`! \n BTW: There were `" + hundreds + "` hundred(s) in your numberlist.")
    }
}