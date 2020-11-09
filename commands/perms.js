var userData = require('../userData.json')
const fs = require('fs');
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
        const permissions = [
            'CREATE_INSTANT_INVITE',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'ADD_REACTIONS',
            'VIEW_AUDIT_LOG',
            'VIEW_CHANNEL',
            'READ_MESSAGES',
            'SEND_MESSAGES',
            'SEND_TTS_MESSAGES',
            'MANAGE_MESSAGES',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'MENTION_EVERYONE',
            'USE_EXTERNAL_EMOJIS',
            'EXTERNAL_EMOJIS',
            'CONNECT', // Voice Channel
            'SPEAK',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'USE_VAD', // Voice Auto Detection
            'CHANGE_NICKNAME',
            'MANAGE_NICKNAMES',
            'MANAGE_ROLES',
            'MANAGE_ROLES_OR_PERMISSIONS',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS'
        ]
        var userPerms = []
        var user = mention? mention:message.client.user
        if (message.guild.member(user).hasPermission("ADMINISTRATOR")) {
            userPerms.push("ADMINISTRATOR")
        } else {
            for (var permission in permissions) {
                if (message.guild.member(user).hasPermission(permission)) {
                    userPerms.push(permission)
                }
            }
        }
        
        var embed = new discord.MessageEmbed()
        embed.setTitle(user.tag + "'s Permissions:")
        embed.setDescription(userPerms.join("\n"))
        embed.setFooter("USE_VAD means 'Use voice auto detection'.")
        message.channel.send(embed)
    }
}