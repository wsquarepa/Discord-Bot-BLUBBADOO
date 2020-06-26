var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const shopData = require('../shop.json')
const specialShopData = require('../specialShop.json')

module.exports = {
    name: 'sell',
	description: 'Sell an item from your inventory!',
    args: true,
    usage: '<item name> [amount]',
    guildOnly: false,
    aliases: [],
    cooldown: 3,
	execute(message, args, mention) {
        var itemName = args[0].toLowerCase()
        var amount = (args[1] == null? 1 : parseInt(args[1]))
        
        var invKeys = Object.keys(userData[message.author.id].inventory)
        if (!invKeys.includes(itemName)) {
            message.channel.send("You can't sell an item(s) you don't own.")
            return false;
        }

        if (amount == NaN && args[1].toLowerCase() == "all") {
            amount = userData[message.author.id].inventory[itemName].amount
        }

        if (userData[message.author.id].inventory[itemName].amount < amount) {
            message.channel.send("You can't sell more than you own.")
            return false;
        }

        userData[message.author.id].inventory[itemName].amount -= amount
        var earnings = 0
        var gems = false
        try {
            earnings = Math.floor(shopData[itemName].price * 0.8)
        } catch {
            try {
                earnings = specialShopData[itemName].price
                gems = true
            } catch {
                message.channel.send("That must be an outdated item, as it doesn't exist in either shops.")
                return false
            }
        }

        if (gems) 
            userData[message.author.id].gems += earnings
        else 
            userData[message.author.id].cash += earnings
        
        message.channel.send("You sold " + amount + " " + itemName + "(s) for $" + earnings)
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}