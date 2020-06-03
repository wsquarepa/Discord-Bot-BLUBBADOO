const discord = require('discord.js')
const userData = require('../userData.json')

module.exports = {
    name: 'money',
	description: '',
    args: false,
    usage: '',
    guildOnly: false,
    aliases:['bal'],
    cooldown: 0.5,
	execute(message, args) {
        var mention = message.mentions.users.first()
        
        if (mention) {
            
            if (mention.bot) {
                message.channel.send("Are you crazy the bot obviously doesn't have money")
                return;
            }

            var cash = userData[mention.id].cash
            var bank = userData[mention.id].bank
            var gems = userData[mention.id].gems
            var embed = new discord.MessageEmbed()
                .setTitle(mention.username + "'s balance:")
                .setDescription("Cash: $" + cash + " \n Bank: $" + bank + "\n Gems: " + gems + "💎")
                .setColor("00ff00")
            message.channel.send(embed)
            return
        }
        var cash = userData[message.author.id].cash
        var bank = userData[message.author.id].bank
        var gems = userData[message.author.id].gems
        var embed = new discord.MessageEmbed()
                .setTitle("Your balance:")
                .setDescription("Cash: $" + cash + " \n Bank: $" + bank + "\n Gems: " + gems + "💎")
                .setColor("00ff00")
                .setFooter("Account status - locked: " + userData[message.author.id].account.secured)
        message.channel.send(embed)
    }
}