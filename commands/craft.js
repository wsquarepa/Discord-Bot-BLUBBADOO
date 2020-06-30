var userData = require('../userData.json')
const craftables = require("../craftables.json")
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'craft',
	description: 'Craft items!',
    args: false,
    usage: '[item]',
    guildOnly: false,
    aliases: ['create', "make"],
	execute(message, args, mention) {
        var keys = Object.keys(craftables)
        if (!args.length) {
            var string = keys.join("`\n`")
            message.channel.send("`" + string + "`")
        }

        if (!keys.includes(args[0])) {
            message.channel.send("`" + args[0] + "` is not an item.")
        }

        
    }
}