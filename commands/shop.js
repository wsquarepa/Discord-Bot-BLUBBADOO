const shopData = require('../shop.json')
const discord = require('discord.js')
const functions = require("../jsHelpers/functions")

function emoji(id, message) {
    return message.client.emojis.cache.find(x => x.id == id).toString()
}

module.exports = {
    name: 'shop',
	description: 'See the shop!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['store'],
    cooldown: 1,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        var pages = []
        var keys = Object.keys(shopData)
        keys.splice(0, 1)
        var keysLength = keys.length
        for (var i = 0; i < (keysLength / 5); i++) {
            try {
                pages.push(keys.splice(0, 5))
            } catch {
                //pass
            }
        }

        console.log("[SHARD/DEBUG] " + pages)

        var page = (args[0] == null? 0:parseInt(args[0]) - 1)
        console.log("[SHARD/DEBUG] " + page)
        keys = pages[page]
        if (!keys) {
            message.channel.send("That page doesn't exist.")
            functions.giveAchivement(message, "Shop Looker")
            return false
        }

        var embed = new discord.MessageEmbed()
            .setTitle("Welcome to the shop!")
            .setDescription("Shop balance: $" + shopData.shopBalance)
            .setColor("00ff00")
        for (var i = 0; i < keys.length; i++) {
            embed.addField((shopData[keys[i]].image.length > 5? emoji(shopData[keys[i]].image, message):shopData[keys[i]].image) + 
            " " + keys[i] + " - $" + shopData[keys[i]].price, shopData[keys[i]].description + `
            Stock remaining: ${shopData[keys[i]].stock.remaining}
            ${shopData[keys[i]].stock.remaining == 0? "Next reload in " + new Date((shopData[keys[i]].stock.nextRestock - Date.now())).toTimeString().slice(3, 8) + " (mm:ss).":""}
            `)
        }

        embed.setFooter("Shop page #" + (page + 1) + " out of " + pages.length + " pages.")

        message.channel.send(embed)
    }
}