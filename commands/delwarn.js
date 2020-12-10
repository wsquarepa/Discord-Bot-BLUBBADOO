var guildData = require("../guildData.json")
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'delwarn',
	description: 'Delete warnings from a user.',
    args: true,
    usage: '<warning id>',
    guildOnly: true,
    aliases: ['deletewarning'],
    cooldown: 3,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
            message.channel.send("You cannot do that, my friend!")
            return;
        }

        if (!guildData[message.guild.id].warnings[args[0]]) {
            message.channel.send("That warning does not exist!")
            return
        }

        delete guildData[message.guild.id].warnings[args[0]]
        fs.writeFile("./guildData.json", JSON.stringify(guildData), (err) => err !== null ? console.error("[ERROR/SHARD] " + err) : null)
        message.channel.send("Warning `" + args[0] + "` deleted!")
    }
}