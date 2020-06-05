const MessageEmbed = require("discord.js").MessageEmbed

module.exports = {
    name: 'ban',
	description: 'Ban a member',
    args: true,
    usage: '<member> [reason]',
    guildOnly: true,
	execute(message, args, mention) {
        if (!(message.member.hasPermission("BAN_MEMBERS")) && !(message.member.id == 509874745567870987)) {
            var embed = new MessageEmbed().setTitle("Error").setAuthor(message.author).setDescription("You can't do that").setColor("ff0000")
            message.channel.send(embed)
            return;
        }

        if (!mention) {
            return message.channel.send("Mention someone please.")
        }

        var reason = args.splice(1)
        reason = reason.join(" ")

        message.channel.send(mention.username + " has been banned for the reason " + reason)
        mention.send("You have been banned from " + message.guild.name + " for \n" + reason).then(function() {
            message.guild.member(mention).ban({reason: reason}).catch(e => {
                console.log(e)
                message.channel.send("Something went wrong while banning the user. Maybe I don't have permissions?")
            })
        })
    }
}