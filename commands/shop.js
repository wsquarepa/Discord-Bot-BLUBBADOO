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
	execute(message, args, mention) {
        var keys = Object.keys(shopData)
        var itemString = ""
        for (var i = 0; i < keys.length; i++) {
            itemString += (shopData[keys[i]].image.length > 2? emoji(shopData[keys[i]].image, message):shopData[keys[i]].image) + 
            " " + keys[i] + " - " + (shopData[keys[i]].price == -1? shopData[keys[i]].gems + " 💎" :"$" + shopData[keys[i]].price) + "\n \n"
        }

        var embed = new discord.MessageEmbed()
            .setTitle("Welcome to the shop!")
            .setDescription(itemString)
            .setColor("00ff00")
        message.channel.send(embed)
    }
}