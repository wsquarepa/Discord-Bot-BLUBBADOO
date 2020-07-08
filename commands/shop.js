const shopData = require('../shop.json')
const discord = require('discord.js')

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
        var keysLength = keys.length
        for (var i = 0; i < (keysLength / 5); i++) {
            try {
                pages.push(keys.splice(0, 5))
            } catch {
                //pass
            }
        }

        console.log(pages)

        var page = (args[0] == null? 0:parseInt(args[0]) - 1)
        console.log(page)
        keys = pages[page]
        if (!keys) {
            message.channel.send("That page doesn't exist.")
            return false
        }

        var embed = new discord.MessageEmbed()
            .setTitle("Welcome to the shop!")
            .setDescription("$$$ THIS SHOP IS A **MONEY** SHOP $$$")
            .setColor("00ff00")
        for (var i = 0; i < keys.length; i++) {
            embed.addField((shopData[keys[i]].image.length > 5? emoji(shopData[keys[i]].image, message):shopData[keys[i]].image) + 
            " " + keys[i] + " - $" + shopData[keys[i]].price, shopData[keys[i]].description)
        }

        embed.setFooter("Shop page #" + (page + 1) + " out of " + pages.length + " pages.")

        message.channel.send(embed)
    }
}