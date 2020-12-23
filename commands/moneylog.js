const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")
const haste = require("hastebin")

module.exports = {
    name: 'moneylog',
	description: 'Money Log',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "economy",
    adminOnly: true,
	execute(message, args, mention, specialArgs) {
        var log = fs.readFileSync("./money-log.txt").toString()
        if (log.length > 256) {
            haste.createPaste(log).then(url => {
                log = log.split("\n")
                log = log.slice(Math.max(log.length - 15, 0))
                const embed = new discord.MessageEmbed()
                embed.setTitle("Last 15 actions:")
                embed.setDescription("``` \n " + log.join("\n") + " ``` More [here](" + url + " 'Haste Online')")
                embed.setColor(functions.globalEmbedColor)
                embed.setTimestamp(Date.now())
                message.channel.send(embed)
            })
        } else {

        }
    }
}