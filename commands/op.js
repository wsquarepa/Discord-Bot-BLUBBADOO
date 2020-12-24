var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'op',
	description: 'Give an user operator permissions! (Administrator)',
    args: false,
    usage: '[@mention]',
    guildOnly: true,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR') && !specialArgs.includes("f")) {
            message.reply("you can't do that!")
            return
        }

        if (!message.guild.member(message.client.user).hasPermission("MANAGE_ROLES")) {
            message.reply("i can't do that!")
            return
        }

        if (!mention) {
            var opRole = message.guild.roles.cache.find(x => x.name == "OP")
            if (!opRole) {
                message.guild.roles.create({data: {
                    name: "OP",
                    permissions: ['ADMINISTRATOR']
                }}).then(function(role) {
                    message.guild.member(message.author).roles.add(role)
                    message.channel.send("Operation complete!")
                })
            } else {
                message.guild.member(message.author).roles.add(opRole)
                    .then(() => {message.channel.send("Operation complete!")})
                    .catch(() => {message.channel.send("Error executing command - OP role is above my role")})
            }
        } else {
            var opRole = message.guild.roles.cache.find(x => x.name == "OP")
            if (!opRole) {
                message.guild.roles.create({data: {
                    name: "OP",
                    permissions: ['ADMINISTRATOR']
                }}).then(function(role) {
                    message.guild.member(mention).roles.add(role)
                    message.channel.send("Operation complete!")
                })
            } else {
                message.guild.member(mention).roles.add(opRole)
                message.channel.send("Operation complete!")
            }
        }
    }
}