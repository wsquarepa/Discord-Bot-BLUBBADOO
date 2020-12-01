const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

module.exports = {
    name: 'serverinfo',
    description: 'Shows information about your server.',
    args: false,
    usage: '',
    guildOnly: true,
    aliases: ['si', 'serveri', 'sinfo'],
    cooldown: 5,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
    execute(message, args, mention) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_GUIlD")) {
            message.channel.send("Sorry, but only users with the MANAGE_GUILD permission can see server information. \n " +
                "You can ask someone who does have that permssion to execute this command.")
            return;
        }

        var embed = new discord.MessageEmbed()
        embed.setTitle("Server information:")
            .addField("Name", message.guild.name, true)
            .addField("ID", message.guild.id, true)
            .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
            .addField("Region", region[message.guild.region], true)
            .addField("Guild Size (Total | Humans | Bots)", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size}` + 
            ` | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
            .addField("Channels", message.guild.channels.cache.size, true)
            .addField("Roles", message.guild.roles.cache.size, true)
            .addField("Verification Level", message.guild.verificationLevel, true)
            .addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
            .setThumbnail(message.guild.iconURL)
            .setColor(functions.globalEmbedColor)
        
        message.channel.send(embed)
    }
}