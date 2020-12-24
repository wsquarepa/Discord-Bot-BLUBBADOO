const fs = require('fs');
const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'rules',
    description: 'Blubbadoo Rules. You must comply.',
    args: false,
    usage: '',
    guildOnly: false,
    aliases: [],
    cooldown: 10,
    levelRequirement: 0,
    category: "info",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        const embed = new discord.MessageEmbed({
            title: "Blubbadoo Rules",
            description: "You must comply to these rules, otherwise you will be banned/blacklisted from using me.",
            color: functions.globalEmbedColor,
            fields: [{
                    name: "You may not use alt. accounts to earn money. This is qualified cheating, and all alt. accounts will be banned/blacklisted.",
                    value: "This rule is put in place to preserve the integrity of the economy. Be warned that all money transactions are recorded."
                },
                {
                    name: "Any exploits are not permitted and will result in you getting banned/blacklisted.",
                    value: "This rule is put in place to preserve the integrity of the economy."
                },
                {
                    name: "Do not deliberately try to slow down the bot.",
                    value: "You are not the only person to use the bot."
                }
            ],
            footer: {
                text: "Bans are non-negotiable. Don’t get banned."
            }
        })
        message.channel.send(embed)
    }
}