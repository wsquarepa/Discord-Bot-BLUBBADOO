const guildData = require('../guildData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'warnings',
	description: 'Check your or someone else\'s warnings!',
    args: false,
    usage: '[@mention]',
    guildOnly: true,
    aliases: ['warns'],
    cooldown: 2,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention) {
        if (!mention) {
            const guild = guildData[message.guild.id]
            var warnings = {}
            const keys = Object.keys(guild.warnings)
            var intNumber = 0
            for (var i = 0; i < guild.warnings.length; i++) {
                if (guild.warnings[keys[i]].user == message.author.id) {
                    warnings[intNumber] = guild.warnings[keys[i]]
                    intNumber++
                }
            }

            const pageNumber = ((parseInt(args[1]) - 1) || 0)
            var pages = []
           
            const embed = new discord.MessageEmbed()
            embed.setTitle("Your warnings:")

            for (var i = 0; i < (keys.length / 5); i++) {
                try {
                    pages.push(keys.splice(0, 5))
                } catch {
                    //pass
                }
            }

            if (keys.length) {
                pages.push(keys)
            }

            if (!pages[0]) {
                embed.setDescription("You have none!")
                embed.setColor("2f3237")
                message.channel.send(embed)
                return
            }
            
            if (!pages[0].length) {
                pages[0] = keys
                pages.splice(1, 1)
            }

            const page = pages[pageNumber]
            
            if (!page && pageNumber != 0) {
                message.channel.send("Not a valid page!")
                return
            }
            
            if (!page || (page.length < 1 && pageNumber == 0)) {
                embed.setDescription("You have none!")
                embed.setColor("2f3237")
                message.channel.send(embed)
                return
            }

            for (i = 0; i < page.length; i++) {
                if (guild.warnings[page[i]].user == message.author.id) {
                    embed.addField(guild.warnings[page[i]].reason, "Issued by <@" + guild.warnings[page[i]].moderator + ">, ID: **" + page[i] + "**")
                }
            }

            embed.setColor("2f3237")
            embed.setFooter("Page #" + (pageNumber + 1) + " out of " + pages.length + " page(s).")
            message.channel.send(embed)
        } else {
            const guild = guildData[message.guild.id]
            var warnings = {}
            const keys = Object.keys(guild.warnings)
            var intNumber = 0
            for (var i = 0; i < guild.warnings.length; i++) {
                if (guild.warnings[keys[i]].user == mention.id) {
                    warnings[intNumber] = guild.warnings[keys[i]]
                    intNumber++
                }
            }

            const pageNumber = ((parseInt(args[1]) - 1) || 0)
            var pages = []
           
            const embed = new discord.MessageEmbed()
            embed.setTitle(mention.tag + "'s warnings:")

            for (var i = 0; i < (keys.length / 5); i++) {
                try {
                    pages.push(keys.splice(0, 5))
                } catch {
                    //pass
                }
            }

            if (keys.length) {
                pages.push(keys)
            }

            if (!pages[0]) {
                embed.setDescription("They have none!")
                embed.setColor("2f3237")
                message.channel.send(embed)
                return
            }
            
            if (!pages[0].length) {
                pages[0] = keys
                pages.splice(1, 1)
            }

            const page = pages[pageNumber]
            
            if (!page && pageNumber != 0) {
                message.channel.send("Not a valid page!")
                return
            }
            
            if (!page || (page.length < 1 && pageNumber == 0)) {
                embed.setDescription("They have none!")
                embed.setColor("2f3237")
                message.channel.send(embed)
                return
            }

            for (i = 0; i < page.length; i++) {
                if (guild.warnings[keys[i]].user == mention.id) {
                    embed.addField(guild.warnings[page[i]].reason, "Issued by <@" + guild.warnings[page[i]].moderator + ">, ID: **" + page[i] + "**")
                }
            }

            embed.setColor("2f3237")
            embed.setFooter("Page #" + (pageNumber + 1) + " out of " + pages.length + " page(s).")
            message.channel.send(embed)
        }
    }
}