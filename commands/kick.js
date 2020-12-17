const MessageEmbed = require("discord.js").MessageEmbed

module.exports = {
    name: 'kick',
	description: 'kick a member',
    args: true,
    usage: '<member>',
    guildOnly: true,
    category: "moderation",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        if (!(message.member.hasPermission("KICK_MEMBERS")) && !specialArgs.includes("f")) {
            var embed = new MessageEmbed().setTitle("Error").setAuthor(message.author).setDescription("You can't do that!").setColor("ff0000")
            message.channel.send(embed)
            return false;
        }

        if (!message.guild.member(message.client.user).hasPermission("KICK_MEMBERS")) {
            message.channel.send(
'```diff\n' +
`- Missing Permission: KICK_MEMBERS` +
'\n```'
            )
            return
        }
        
        if (!mention) {
            message.channel.send("Mention someone please.")
            return false
        }

        var reason = args.splice(1)
        reason = reason.join(" ")

        message.channel.send("<@" + mention.id + ">" + " has been kicked for the reason `" + reason + "`")
        mention.send("You have been kicked from " + message.guild.name + " for: \n`" + reason + "`").then(function() {
            message.guild.member(mention).kick({reason: reason}).catch(() => message.channel.send("I don't have permission to kick members."))
        })
    }
}