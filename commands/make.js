var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'make',
	description: 'Make something, like a video!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 30,
    levelRequirement: 4,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        const makeables = ['video', 'cake', 'cookie', 'game', 'website', 'discord bot']
        const making = makeables[randomNumber(0, makeables.length - 1)]
        const earnings = randomNumber(100, 1000)

        userData[message.author.id].cash += earnings
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        message.channel.send("You made a " + making + " and sold it for $" + earnings + "!")
    }
}