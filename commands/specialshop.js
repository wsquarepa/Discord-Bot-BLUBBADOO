const shopData = require('../specialShop.json')
const discord = require('discord.js')

function emoji(id, message) {
    return message.client.emojis.cache.find(x => x.id == id).toString()
}

module.exports = {
    name: 'specialshop',
	description: 'See some cool items!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['specialStore'],
    cooldown: 1,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        var keys = Object.keys(shopData)
        var itemString = ""
        for (var i = 0; i < keys.length; i++) {
            itemString += (shopData[keys[i]].image.length > 2? emoji(shopData[keys[i]].image, message):shopData[keys[i]].image) + 
            " " + keys[i] + " - " + " 💎 " + shopData[keys[i]].price + "\n \n"
        }

        var embed = new discord.MessageEmbed()
            .setTitle("Welcome to the special item shop!")
            .setDescription(itemString)
            .setColor("00ff00")
        message.channel.send(embed)
    }
}