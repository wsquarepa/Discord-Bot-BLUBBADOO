var userData = require('../userData.json')
const fs = require('fs');
const functions = require("../jsHelpers/functions")
const discord = require('discord.js')

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
    name: 'rob',
	description: 'Rob a user!',
    args: true,
    usage: '<user: @mention>',
    guildOnly: true,
    aliases: ['steal'],
    cooldown: 3600,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {

        if (mention == null) {
            message.channel.send("You gotta tell me who you wanna rob.")
            return false
        }
        if (!userData[mention.id]) {
            message.channel.send("That person doesn't have a bank account yet.")
            return false;
        }

        if (userData[mention.id].account.type.toLowerCase() == "admin") {
            message.channel.send("Robbing an admin isn't fair as they have indefinite money, so you can't rob admins.")
            return false;
        }

        if (message.author.id == mention.id) {
            message.channel.send("Why would you like to rob yourself? You don't earn anything anyway.")
            return false
        }
        if (userData[message.author.id].cash < 4000) {
            message.channel.send("You cannot rob someone without at least $4000 in cash.")
            return false
        }

        if (userData[message.author.id].inventory["knife"] == null || userData[message.author.id].inventory["knife"].amount < 1) {
            message.channel.send(embed("Error", "Please buy a knife before robbing someone.", "ff0000"))
            return false
        }

        userData[message.author.id].inventory.knife.amount -= 1

        if (userData[mention.id].account.secured) {
            var earnings = userData[message.author.id].cash * 0.5
            earnings = Math.round(earnings)
            userData[message.author.id].cash -= earnings
            userData[mention.id].bank += earnings
            message.channel.send("Oh No! Their account was secured, and whoops! You couldn't hack " + mention.username + "! You were fined $" + earnings + ".")
            //mention.send("Oh no! " + message.author.username + " robbed you, but failed because your account is locked. You got $" + earnings + "!")
            userData[mention.id].account.secured = false
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            return
        }

        var randRobNumber = randomNumber(1, 5)
        if (randRobNumber == 1) {
            var earnings = userData[mention.id].cash * 0.40
            earnings = Math.round(earnings)
            serData[message.author.id].bank += earnings
            userData[mention.id].cash -= earnings
            message.channel.send("You successfully robbed " + mention.username + " and earned $" + earnings)
            mention.send("Oh no! " + message.author.username + " robbed you, and earned $" + earnings + " off of you!")
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            functions.giveAchivement(message, "Robber")
        } else {
            var earnings = userData[message.author.id].cash * 0.5
            earnings = Math.round(earnings)
            userData[message.author.id].cash -= earnings
            userData[mention.id].bank += earnings
            message.channel.send("Ouch! You failed to rob " + mention.username + " and were fined $" + earnings + ".")
            //mention.send("Oh no! " + message.author.username + " **TRIED** to rob you, but failed. You got $" + earnings + "!")
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        }
    }
}