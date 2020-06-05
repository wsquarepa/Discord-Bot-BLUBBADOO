var userData = require('../userData.json')
const fs = require('fs');
const shopData = require('../shop.json')

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'hunt',
	description: 'Hunt an animal!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 40,
	execute(message, args, mention) {
        if (userData[message.author.id].inventory["Knife"] == null || userData[message.author.id].inventory["Knife"].amount < 1) {
            message.channel.send("How do you suppose you hunt without a knife?")
            return
        }

        userData[message.author.id].inventory.Knife.uses -= 1
        if (userData[message.author.id].inventory.Knife.uses < 1) {
            userData[message.author.id].inventory.Knife.amount -= 1
            userData[message.author.id].inventory.Knife.uses = shopData.Knife.uses
        }

        var animals = ['wolf', 'deer', 'lion', 'bigfoot', 'rabbit', 'pig', 'cat']
        var number = randomNumber(1, 7) - 1
        var animal = animals[number]
        var chanceO = randomNumber(1, 4)
        if (chanceO == 1) {
            message.channel.send("You got scared away by a " + animal + " and didn't earn anything.")
            return
        }
        var earnings = randomNumber(50, 200)
        userData[message.author.id].cash += earnings
        message.channel.send(`You successfully hunt a ${animal} and earn $${earnings}!`)
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}