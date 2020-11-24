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
    cooldown: 60,
    levelRequirement: 0,
    category: "info",
    adminOnly: true,
    execute(message, args, mention) {
        try {
            const today = new Date()
            const userDataFilePath = ("./backups/userData/" + (today.getMonth() + "-" + today.getDate() + "-" + today.getFullYear() + "_" +
                today.getHours() + ":" + today.getMinutes()) + ".json")
            fs.writeFile(userDataFilePath, "", (err) => {
                if (err) {
                    console.error(err)
                    message.channel.send("Was not able to make backup")
                }

                var pathToFile = path.join("./userData.json")
                var pathToNewDestination = path.join(userDataFilePath)
                fs.copyFileSync(pathToFile, pathToNewDestination)
                message.channel.send("Created backup `" + userDataFilePath + "` successfully!")

                const botDataFilePath = ("./backups/botData/" + (today.getMonth() + "-" + today.getDate() + "-" + today.getFullYear() + "_" +
                    today.getHours() + ":" + today.getMinutes()) + ".json")
                fs.writeFile(botDataFilePath, "", (err) => {
                    if (err) {
                        console.error(err)
                        message.channel.send("Was not able to make backup")
                    }

                    var pathToFile = path.join("./botData.json")
                    var pathToNewDestination = path.join(botDataFilePath)
                    fs.copyFileSync(pathToFile, pathToNewDestination)
                    message.channel.send("Created backup `" + botDataFilePath + "` successfully!")
                })
            })

        } catch (error) {
            //pass
            console.error(error)
            message.channel.send("Was not able to make backup")
        }
    }
}