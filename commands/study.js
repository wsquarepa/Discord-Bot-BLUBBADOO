var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'study',
	description: 'Study for intellegence points! They help you earn more money while working or making.',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['learn'],
    cooldown: 3600,
    levelRequirement: 5,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        if (userData[message.author.id].inventory["goldenbook"] == null || userData[message.author.id].inventory["goldenbook"].amount < 1) {
            var embed = new discord.MessageEmbed({
                title: "Error",
                description: "You cannot learn without the special goldenbook.",
                color: "ff0000"
            })
            message.channel.send(embed)
            return false
        }

        userData[message.author.id].inventory["goldenbook"].amount--
        message.channel.send("Studying; please wait...").then((msg) => {
            setTimeout(() => {
                userData[message.author.id].intellegencePoints++
                functions.save('./userData.json', userData)
                msg.edit("Amazing! You just learned something from that book... you still don't understand it though... \n" + 
                "Your intellect: " + userData[message.author.id].intellegencePoints)
            }, 2500)
        })
    }
}