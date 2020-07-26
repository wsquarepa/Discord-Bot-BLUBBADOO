var userData = require('../userData.json')
const achivements = require('../jsHelpers/achivements')
const fs = require('fs');
const discord = require("discord.js")
const codes = require("../jsHelpers/codes")

module.exports = {
    name: 'title',
	description: 'Set your title!',
    args: false,
    usage: '[title id]',
    guildOnly: false,
    aliases: [],
    cooldown: 3,
    levelRequirement: 0,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention) {
        if (!args.length) {
            var availableTags = []
            for (var i = 0; i < userData[message.author.id].achivements.length; i++) {
                if (achivements[userData[message.author.id].achivements[i]].reward.title != "") {
                    availableTags.push("ID: " + i + " - " + achivements[userData[message.author.id].achivements[i]].reward.title)
                }
            }

            for (var z = 0; z < userData[message.author.id].codesUsed.length; z++) {
                if (codes[userData[message.author.id].codesUsed[z]].title != "") {
                    availableTags.push("ID: " + (i + z) + " - " + codes[userData[message.author.id].codesUsed[z]].title)
                }
            }
            message.channel.send("Available titles: (use ==title [title id] to set your title) \n" + availableTags.join("\n"))
        } else {
            var id = parseInt(args[0])
            var tag = ""
            try {
                tag = achivements[userData[message.author.id].achivements[id]].reward.title
            } catch {
                try {
                    tag = codes[userData[message.author.id].codesUsed[id - userData[message.author.id].achivements.length]].title
                } catch {
                    message.channel.send("Enter a valid id!")
                    return false;
                }
            }
            userData[message.author.id].account.title = tag
            fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
            message.channel.send("Successfully set tag to: `" + tag + "`")
        }
    }
}