var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'deop',
	description: 'Removes an user from operator permissions! (Administrator)',
    args: false,
    usage: '[@mention]',
    guildOnly: true,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR') && message.author.id != "509874745567870987") {
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
                    message.channel.send("Operation complete!")
                })
            } else {
                message.guild.member(message.author).roles.remove(opRole)
                message.channel.send("Operation complete!")
            }
        } else {
            var opRole = message.guild.roles.cache.find(x => x.name == "OP")
            if (!opRole) {
                message.guild.roles.create({data: {
                    name: "OP",
                    permissions: ['ADMINISTRATOR']
                }}).then(function(role) {
                    message.channel.send("Operation complete!")
                })
            } else {
                message.guild.member(mention).roles.remove(opRole)
                message.channel.send("Operation complete!")
            }
        }
    }
}