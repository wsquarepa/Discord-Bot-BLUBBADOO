const discord = require('discord.js')
const userData = require('../userData.json')

module.exports = {
    name: 'money',
	description: '',
    args: false,
    usage: '',
    guildOnly: false,
    aliases:['bal', 'balance'],
    cooldown: 0.5,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        
        if (mention) {
            
            if (mention.bot) {
                message.channel.send("Fortunately, bots obviously doesn't have money")
                return false;
            }

            if (!userData[mention.id]) {
                message.channel.send("That user doesn't have a bank account yet.")
                return false;
            }

            var cash = userData[mention.id].cash
            var bank = userData[mention.id].bank
            var gems = userData[mention.id].gems
            var embed = new discord.MessageEmbed()
                .setTitle(mention.username + "'s balance:")
                .setDescription("Cash: $" + cash + " \n Bank: $" + bank + "\n Gems: " + gems + "💎")
                .setColor("2f3237")
            message.channel.send(embed)
            return
        }
        var cash = userData[message.author.id].cash
        var bank = userData[message.author.id].bank
        var gems = userData[message.author.id].gems
        var embed = new discord.MessageEmbed()
                .setTitle("Your balance:")
                .setDescription("Cash: $" + cash + " \n Bank: $" + bank + "\n Gems: " + gems + "💎")
                .setColor("2f3237")
                .setFooter("Account status - locked: " + userData[message.author.id].account.secured)
        message.channel.send(embed)
    }
}