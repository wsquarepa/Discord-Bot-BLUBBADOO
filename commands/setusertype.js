var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'setusertype',
	description: 'Set an user\'s type to something!',
    args: true,
    usage: '<@mention> <type>',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "economy",
    adminOnly: true,
	execute(message, args, mention, specialArgs) {
        if (!mention) {
            return message.channel.send("Mention someone!")
        }

        if (!args[1]) {
            return message.channel.send("Add a type!")
        }
        
        userData[mention.id].account.type = args.splice(1).join(" ")
        message.channel.send("Complete! " + mention.username + " is now a " + userData[mention.id].account.type + "!")
    }
}