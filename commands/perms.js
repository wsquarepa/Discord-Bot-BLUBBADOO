const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'perms',
    description: 'Find the permissions of either me or a user.',
    args: false,
    usage: '[@user]',
    guildOnly: true,
    aliases: ['permissions'],
    cooldown: 2,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
    execute(message, args, mention) {
        const user = mention? mention:message.client.user
        var userPerms = message.guild.member(user).permissions.toArray()
        if (message.guild.member(user).hasPermission("ADMINISTRATOR")) {
            userPerms = ["ADMINISTRATOR"]
        }

        var embed = new discord.MessageEmbed()
        embed.setTitle(user.tag + "'s Permissions:")
        embed.setDescription(userPerms.join("\n"))
        embed.setFooter("USE_VAD means 'Use voice auto detection'.")
        embed.setColor(functions.globalEmbedColor)
        message.channel.send(embed)
    }
}