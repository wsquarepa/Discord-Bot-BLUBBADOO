const shopData = require('../shop.json')
const fs = require('fs');
var userData = require('../userData.json')
const discord = require('discord.js')
const specialShopData = require('../specialShop.json')

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
        args[0] = args[0].toLowerCase()
        if (!keys.includes(args[0])) {
            keys = Object.keys(specialShopData)
            if (!keys.includes(args[0])) {
                message.channel.send("That's not an item from either shops.")
                return false
            }

            if (args[1] == null) {
                args[1] = 1
            }

            args[1] = parseInt(args[1])

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
            var embed = new discord.MessageEmbed()
            embed.setTitle("Success!")
            embed.setDescription(`Successful! You bought ${args[1] == null? "1":args[1]} ${args[0]}${args[1] != null? "s":""}!`)
            embed.setColor("00ff00")
            embed.setFooter("Sorry for the grammar it's hard ok?")
            message.channel.send(embed)
            return true
        }

        if (args[1] == null) {
            args[1] = 1
        }

        args[1] = parseInt(args[1])

        if (shopData[args[0]].price * args[1] > userData[message.author.id].cash) {
            message.channel.send("You obviously can't buy that. Get more **CASH**.")
            return false
        }

        if (shopData[args[0]].price == -1) {
            if (shopData[args[0]].gems * args[1] > userData[message.author.id].gems) {
                message.channel.send("You obviously can't buy that. Get more **GEMS**.")
                return false
            }
            userData[message.author.id].gems -= shopData[args[0]].gems * args[1]
            if (userData[message.author.id].inventory[args[0]]) {
                userData[message.author.id].inventory[args[0]].amount += args[1]
            } else {
                userData[message.author.id].inventory[args[0]] = {
                    amount: args[1],
                    uses: shopData[args[0]].uses
                }
            }
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            var embed = new discord.MessageEmbed()
            embed.setTitle("Success!")
            embed.setDescription(`Successful! You bought ${args[1] == null? "1":args[1]} ${args[0]}${args[1] != null? "s":""}!`)
            embed.setColor("00ff00")
            embed.setFooter("Sorry for the grammar it's hard ok?")
            message.channel.send(embed)
            return true
        }

        userData[message.author.id].cash -= shopData[args[0]].price * args[1]
        if (userData[message.author.id].inventory[args[0]]) {
            userData[message.author.id].inventory[args[0]].amount += args[1]
        } else {
            userData[message.author.id].inventory[args[0]] = {
                amount: args[1],
                uses: shopData[args[0]].uses
            }
        }
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
        var embed = new discord.MessageEmbed()
        embed.setTitle("Success!")
        embed.setDescription(`Successful! You bought ${args[1] == null? "1":args[1]} ${args[0]}${args[1] != null? "(s)":""}!`)
        embed.setColor("00ff00")
        embed.setFooter("Sorry for the grammar it's hard ok?")
        message.channel.send(embed)
    }
}