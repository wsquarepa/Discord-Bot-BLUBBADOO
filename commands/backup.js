var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")
const path = require('path')

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
            const filepath = ("../backups/" + Date.now() + ".json")
            fs.writeFile(filepath, "")
			var pathToFile = path.join("../userData.json")
			var pathToNewDestination = path.join(filepath)
			fs.copyFileSync(pathToFile, pathToNewDestination)
		} catch (error) {
			//pass
            console.log("Was not able to make a backup")
            console.error(error)
		}
    }
}