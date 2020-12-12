var userData = require('../userData.json')
const fs = require('fs');
const discord = require('discord.js')
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'work',
	description: 'Work for money!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 900,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        var min = Math.ceil(100);
        var max = Math.floor(500);
        var earnings = (Math.floor(Math.random() * (max - min + 1)) + min) * userData[message.author.id].intellegencePoints

        userData[message.author.id].cash += earnings

        var workTypes = fs.readFileSync("./jobslist.txt").toString().split("\n")
        var workType = workTypes[Math.floor((Math.random() * workTypes.length))]
        
        var embed = new discord.MessageEmbed()
        embed.setTitle("Work Success!")
        embed.setDescription(`You got $${earnings} from working as a ${workType}!`)
        embed.setColor(functions.globalEmbedColor)
        message.channel.send(embed)
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
    }
}