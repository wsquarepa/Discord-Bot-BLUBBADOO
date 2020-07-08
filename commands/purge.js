var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'purge',
	description: 'Purge/Clear messages!',
    args: false,
    usage: '[messages]',
    guildOnly: true,
    aliases: ['clear', 'delete'],
    cooldown: 2.3,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {

        if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) {
            message.reply("you can't do that!")
            return false;
        }
 
        message.delete().then(function() {
            try {
                args[0] = parseInt(args[0])
    
                if (args[0].toString() == "NaN") {
                    args[0] = 100
                }
            } catch {
                args[0] = 100
            }
    
            message.channel.bulkDelete(args[0], true).catch(function(error) {
                console.error(error)
                message.channel.send("Uh oh, it seems like I don't have permissions to do that!")
            }).then(function(messages) {
                message.channel.send(messages.size + " message(s) deleted!").then(m => m.delete({timeout: 2000}))
            })
        })
    }
}