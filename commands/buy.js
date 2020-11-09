var shopData = require('../shop.json')
const fs = require('fs');
var userData = require('../userData.json')
const discord = require('discord.js')
const specialShopData = require('../specialShop.json')
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'buy',
    description: 'Buy an item!',
    args: true,
    usage: '<itemName: Case sensitive> [quantity]',
    guildOnly: false,
    aliases: [],
    cooldown: 2,
    category: "economy",
    adminOnly: false,
    execute(message, args, mention) {
        var keys = Object.keys(shopData)
        keys.splice(0, 1)
        args[0] = args[0].toLowerCase()

        if (args[0] == "all") {
            var totalprice = 0
            for (var i = 0; i < keys.length; i++) {
                totalprice += (shopData[keys[i]].price * shopData[keys[i]].stock.remaining)
            }

            if (totalprice > userData[message.author.id].cash) {
                message.channel.send("You obviously can't buy all of that. You need $" + totalprice + " and you have $" +
                    userData[message.author.id].cash + " in your cash.")
                return false
            }

            for (i = 0; i < keys.length; i++) {
                const amountToBuy = shopData[keys[i]].stock.remaining
                userData[message.author.id].cash -= shopData[keys[i]].price * amountToBuy
                shopData.shopBalance += shopData[keys[i]].price * amountToBuy
                shopData[keys[i]].stock.remaining -= amountToBuy
                if (userData[message.author.id].inventory[keys[i]]) {
                    userData[message.author.id].inventory[keys[i]].amount += amountToBuy
                } else {
                    userData[message.author.id].inventory[keys[i]] = {
                        amount: amountToBuy,
                        uses: shopData[keys[i]].uses
                    }
                }
            }

            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            fs.writeFile("./shop.json", JSON.stringify(shopData), (err) => err !== null ? console.error(err) : null)
            var embed = new discord.MessageEmbed()
            embed.setTitle("Success!")
            embed.setDescription(`Successful! You bought EVERYTHING! \n (Well everything that was in-stock)`)
            embed.setColor(functions.globalEmbedColor)
            message.channel.send(embed)
        } else if (!keys.includes(args[0])) {
            keys = Object.keys(specialShopData)
            if (!keys.includes(args[0])) {
                message.channel.send("That's not an item from either shops.")
                return false
            }

            if (!args[1]) {
                args[1] = 1
            }

            args[1] = parseInt(args[1])

            if (isNaN(args[1])) {
                message.channel.send("Enter a number.")
                return;
            }

            if (specialShopData[args[0]].price * args[1] > userData[message.author.id].gems) {
                message.channel.send("You obviously can't buy that. Get more **GEMS**.")
                return false
            }

            userData[message.author.id].gems -= specialShopData[args[0]].price * args[1]
            if (userData[message.author.id].inventory[args[0]]) {
                userData[message.author.id].inventory[args[0]].amount += args[1]
            } else {
                userData[message.author.id].inventory[args[0]] = {
                    amount: args[1],
                    uses: specialShopData[args[0]].uses
                }
            }
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            fs.writeFile("./shop.json", JSON.stringify(shopData), (err) => err !== null ? console.error(err) : null)
            var embed = new discord.MessageEmbed()
            embed.setTitle("Success!")
            embed.setDescription(`Successful! You bought ${args[1] == null? "1":args[1]} ${args[0]}${args[1] != null? "s":""}!`)
            embed.setColor(functions.globalEmbedColor)
            embed.setFooter("Sorry for the grammar it's hard ok?")
            message.channel.send(embed)
            return true
        } else {
            if (args[1] == null) {
                args[1] = 1
            }

            if (isNaN(parseInt(args[1]))) {
                if (args[1] == "all") {
                    args[1] = shopData[args[0]].stock.remaining
                } else {
                    message.channel.send("Enter a number.")
                    return;
                }
            } else {
                args[1] = parseInt(args[1])
            }

            if (shopData[args[0]].price * args[1] > userData[message.author.id].cash) {
                message.channel.send("You obviously can't buy that. Get more **CASH**.")
                return false
            }

            if (shopData[args[0]].stock.remaining < args[1]) {
                message.channel.send("Uh oh! The shop doesn't have enough stock!")
                return false
            }

            userData[message.author.id].cash -= shopData[args[0]].price * args[1]
            shopData.shopBalance += shopData[args[0]].price * args[1]
            shopData[args[0]].stock.remaining -= args[1]
            if (userData[message.author.id].inventory[args[0]]) {
                userData[message.author.id].inventory[args[0]].amount += args[1]
            } else {
                userData[message.author.id].inventory[args[0]] = {
                    amount: args[1],
                    uses: shopData[args[0]].uses
                }
            }
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            fs.writeFile("./shop.json", JSON.stringify(shopData), (err) => err !== null ? console.error(err) : null)
            var embed = new discord.MessageEmbed()
            embed.setTitle("Success!")
            embed.setDescription(`Successful! You bought ${args[1] == null? "1":args[1]} ${args[0]}${args[1] != null? "(s)":""}!`)
            embed.setColor(functions.globalEmbedColor)
            embed.setFooter("Sorry for the grammar it's hard ok?")
            message.channel.send(embed)
        }
    }
}