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
            const filepath = ("../backups/userData/" + Date.now() + ".json")
            fs.writeFile(filepath, "", (err) => {
                if (err) {
                    console.error(err)
                    message.channel.send("Was not able to make backup")
                }

                var pathToFile = path.join("../userData.json")
                var pathToNewDestination = path.join(filepath)
                fs.copyFileSync(pathToFile, pathToNewDestination)
                message.channel.send("Created backup `" + filepath + "` successfully!")
            })
			
		} catch (error) {
            //pass
            console.error(error)
            message.channel.send("Was not able to make backup")
		}
    }
}