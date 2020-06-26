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
	execute(message, args, mention) {

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