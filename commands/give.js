var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'give',
	description: 'Give money to someone!',
    args: true,
    usage: '<@user> <amount>',
    guildOnly: true,
    aliases: ['givemoney'],
    cooldown: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        if (!mention) {
            message.channel.send("@mention someone please.")
            return false
        }
        
        if (!userData[mention.id]) {
            message.channel.send("Sorry, but that user doesn't have a bank account yet.")
            return false
        }

        var user = userData[message.author.id]

        if (!parseInt(args[1])) {
            message.channel.send("Choose something to give!")
            return false
        }

        if (parseInt(args[1]) > user.cash) {
            message.channel.send("You don't have enough **cash** to give.")
            return false
        }

        if (parseInt(args[1]) < 1000) {
            message.channel.send("You have to give **at least** $1000 from your cash.")
            return false
        }

        var cashAmt = parseInt(args[1])

        userData[mention.id].bank += cashAmt
        userData[message.author.id].cash -= cashAmt

        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)

        message.channel.send("Successfully gave " + mention.username + " $" + cashAmt + ". It is now in their bank.")
    }
}