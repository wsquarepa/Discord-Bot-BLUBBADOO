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

        const hoes = ["788834848038846545", "788834848244629514", "788834847997165650", "788834848201769031", "788834848386973716", "788833879892819988"]
        
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
        message.channel.send(functions.emoji(hoes[functions.randomNumber(0, hoes.length - 1)]) + " You harvested " + earnings + " carrots. Sell all of them using `" 
        + message.guild? guildData[message.guild.id].prefix:"=="  + "sell carrot all`!")
    }
}