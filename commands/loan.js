var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const guildData = require('../guildData.json')
const functions = require("../jsHelpers/functions")

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = {
    name: 'loan',
	description: 'Loan money from the bank!',
    args: false,
    usage: '[amount]',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        const embed = new discord.MessageEmbed()
        if (!isEmpty(userData[message.author.id].loan) && !args.length) {
            embed.setTitle("Your active loan:")
            embed.setDescription(
            `Amount: ${userData[message.author.id].loan.amount}
            Expires in (hh:mm:ss): ${new Date(userData[message.author.id].loan.expires).toTimeString().slice(0, 8)}`)
            embed.setColor("2f3237")
            message.channel.send(embed)
        } else if (!args.length) {
            embed.setTitle("Your active loan:")
            embed.setDescription("You don't have a loan yet!")
            embed.setColor("2f3237")
            embed.setFooter("To get one, do " + guildData[message.guild.id].prefix + "loan [amount]!")
            message.channel.send(embed)
        } else if (args[0] == "pay") {
            const amount = parseInt(args[1])
            
            if (isNaN(amount)) {
                message.channel.send("You cannot pay that.")
                return false;
            }

            if (amount > userData[message.author.id].loan.amount) {
                message.channel.send("That's above your loan amount!")
                return false;
            }

            const paypercent = (amount / userData[message.author.id].loan.amount).toFixed(2) * 100

            userData[message.author.id].loan.amount -= amount
            userData[message.author.id].cash -= amount

            if (userData[message.author.id].loan.amount <= 0) {
                userData[message.author.id].loan = {}
            }
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            
            embed.setTitle("Complete!")
            embed.setDescription("You paid off " + paypercent + "% of your loan!")
            embed.setColor("2f3237")
            message.channel.send(embed)
        } else {
            const amount = parseInt(args[0])
            const maxAmount = userData[message.author.id].level * 10000

            if (isNaN(amount)) {
                message.channel.send("You cannot loan that.")
                return false;
            }

            if (amount > maxAmount) {
                message.channel.send("Sorry, but you can't loan that much. You can loan a maximum of $" + maxAmount + "!")
                return false;
            }

            if (userData[message.author.id].cash < 1) {
                message.channel.send("You cannot loan with less than $1.")
                return false;
            }

            if (amount < 10000) {
                message.channel.send("To keep the integrity of the economy, you cannot loan money below $10000.")
                return false
            }

            userData[message.author.id].loan.amount = (amount * 1.07).toFixed(0)
            userData[message.author.id].loan.expires = Date.now() + (1000 * 60 * 60 * 24) //one day
            userData[message.author.id].cash += amount
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)

            embed.setTitle("Success!")
            embed.setDescription("You loaned $" + amount + " from the bank!")
            embed.setColor("2f3237")

            functions.giveAchivement(message, "Loaner")

            message.channel.send(embed)
        }
    }
}