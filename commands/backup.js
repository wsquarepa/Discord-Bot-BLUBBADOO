var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'backup',
	description: 'Create a backup',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "info",
    adminOnly: true,
	execute(message, args, mention) {
        try {
			var pathToFile = path.join("../userData.json")
			var pathToNewDestination = path.join("../backups/", Date.now() + ".json")
			fs.copyFileSync(pathToFile, pathToNewDestination)
		} catch {
			//pass
			console.log("Was not able to make a backup")
		}
    }
}