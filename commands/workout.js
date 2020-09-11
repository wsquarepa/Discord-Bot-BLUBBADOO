var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")
const shopData = require("../shop.json")

module.exports = {
    name: 'workout',
	description: 'Work out to up your strength and defence!',
    args: false,
    usage: '[strength | defence]',
    guildOnly: false,
    aliases: ['exercise'],
    cooldown: 20,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        if (!args.length) args[0] = "s"
        if (!args[0].startsWith("s") && !args[0].startsWith("d")) args[0] = "s"

        if (args[0].startsWith("s")) {
            if (userData[message.author.id].inventory["dumbbell"] == null || userData[message.author.id].inventory["dumbbell"].amount < 1) {
                message.channel.send(embed("Error", "You cannot do that without a dumbbell.", "ff0000"))
                return false
            }

            userData[message.author.id].inventory.dumbbell.uses -= 1
            if (userData[message.author.id].inventory.dumbbell.uses < 1) {
                userData[message.author.id].inventory.dumbbell.amount -= 1
                userData[message.author.id].inventory.dumbbell.uses = shopData.dumbbell.uses
            }

            userData[message.author.id].strength++
            message.channel.send("Gettin' buff here at " + userData[message.author.id].strength + " strength.")
        } else {
            if (userData[message.author.id].inventory["gloves"] == null || userData[message.author.id].inventory["gloves"].amount < 1) {
                message.channel.send(embed("Error", "You cannot do that without gloves.", "ff0000"))
                return false
            }

            userData[message.author.id].inventory.gloves.uses -= 1
            if (userData[message.author.id].inventory.gloves.uses < 1) {
                userData[message.author.id].inventory.gloves.amount -= 1
                userData[message.author.id].inventory.gloves.uses = shopData.gloves.uses
            }

            userData[message.author.id].defence++
            message.channel.send("Gettin' protec here at " + userData[message.author.id].defence + " defence.")
        }
    }
}