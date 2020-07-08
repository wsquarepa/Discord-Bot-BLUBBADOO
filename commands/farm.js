var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

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
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        message.channel.send("You harvested " + earnings + " carrots. Sell all of them using `==sell carrot " + earnings + "`!")
    }
}