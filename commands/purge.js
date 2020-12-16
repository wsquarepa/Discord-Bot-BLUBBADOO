var userData = require('../userData.json')
const fs = require('fs');
const discord = require("discord.js")

module.exports = {
    name: 'purge',
    description: 'Purge/Clear messages!',
    args: false,
    usage: '[messages]',
    guildOnly: true,
    aliases: ['clear', 'delete'],
    cooldown: 2.3,
    category: "moderation",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {

        if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES") && message.author.id != "509874745567870987") {
            message.reply("you can't do that!")
            return false;
        }

        if (message.guild.member(message.client.user).hasPermission("MANAGE_MESSAGES")) {
            message.channel.send(
'```diff' +
`- Missing Permission: MANAGE_MESSAGES` +
'```'
            )
            return;
        }

        message.delete().then(function () {
            try {
                args[0] = parseInt(args[0])

                if (isNaN(args[0])) {
                    args[0] = 100
                }
            } catch {
                args[0] = 100
            }

            console.log("[SHARD/DEBUG] Amount to purge: " + args[0])

            var times = -1
            console.log("[SHARD/DEBUG] Greater than 100: " + (args[0] > 100))
            if (args[0] > 100) {
                times = (args[0] - (args[0] % 100)) / 100
            }

            console.log("[SHARD/DEBUG] Times to purge: " + times)

            if (times == -1) {
                console.log("[SHARD/DEBUG] " + "Nagative Times Called")
                message.channel.bulkDelete(args[0], true).catch(function (error) {
                    console.error("[SHARD/ERROR] " + error)
                    message.channel.send("Uh oh, it seems like I don't have permissions to do that!")
                }).then(function (messages) {
                    message.channel.send((messages.size == 0 ? 1 : messages.size) + " message(s) deleted!").then(m => m.delete({
                        timeout: 2000
                    }))
                })
            } else if (times > 10) {
                message.channel.send("Size too large. (" + args[0] + " > 1000)")
                return;
            } else {
                message.channel.send("Deleting...").then(msg2 => {
                    var totalMessagesDeleted = 0
                    for (var i = 0; i < times; i++){
                        message.channel.bulkDelete(100, true).catch(function (error) {
                            message.channel.send("An error occurred while trying to execute that; here's the error: \n ```\n" + error.toString() + "\n```")
                            i = times
                        }).then(msgsDeleted => {
                            totalMessagesDeleted += msgsDeleted.size
                            if (args[0] % 100 != 0 && (i - 1) == times) {
                                message.channel.bulkDelete(args[0] % 100, true).catch().then(msgsDeleted => {
                                    totalMessagesDeleted += msgsDeleted.size
                                    setTimeout(() => {
                                        message.channel.send("Complete! Purged " + totalMessagesDeleted + " messages.")
                                    }, 2000);
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}