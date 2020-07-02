const userData = require('../userData.json')
const discord = require('discord.js')
const shopData = require('../shop.json')

function emoji(id, message) {
    return message.client.emojis.cache.find(x => x.id == id).toString()
}

module.exports = {
    name: 'inventory',
	description: 'Check your inventory!',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: ['inv'],
    cooldown: 3,
	execute(message, args, mention) {
        var userInv = userData[message.author.id].inventory
        var keys = Object.keys(userInv)
        var embed = new discord.MessageEmbed()

        if (keys.toString() == "[]") {
            embed.setTitle("Your inventory").setDescription("You have nothing!").setColor("ff0000")
            message.channel.send(embed)
        } else {
            var itemString = ""
            for (var i = 0; i < keys.length; i++) {
                if (!(parseInt(userInv[keys[i]].amount) < 1)) {
                    var usesDisplay =  "- " + userInv[keys[i]].uses + " use(s) for current item left."
                    itemString += (shopData[keys[i]].image.length > 5? emoji(shopData[keys[i]].image, message):shopData[keys[i]].image) 
                        + " " + userInv[keys[i]].amount + " " + keys[i] + "(s) " + (userInv[keys[i]].uses == 1? "":usesDisplay) + "\n \n"
                }
            }

            if (itemString == "") {
                embed.setTitle("Your inventory").setDescription("You have nothing!").setColor("ff0000")
                message.channel.send(embed)
                return
            }
            embed.setTitle("Your inventory").setDescription(itemString).setColor("00ff00")
            message.channel.send(embed)
        }
    }
}