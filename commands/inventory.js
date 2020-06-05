const userData = require('../userData.json')
const discord = require('discord.js')

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
                itemString += keys[i] + " - " + userInv[keys[i]].amount + "\n \n"
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