module.exports = {
    name: 'send',
	description: 'Send a message to a channel!',
    args: true,
    usage: '<channel mention> <message>',
    guildOnly: true,
    aliases: ['broadcast'],
    cooldown: 2,
	execute(message, args, mention) {
        var channelMention = args[0]
        channelMention = channelMention.substring(2)
        channelMention = channelMention.substring(0, channelMention.length - (1))
        var msg = args.splice(0, 1)
        msg = args.join(" ")
        message.client.channels.cache.get(channelMention).send(msg).catch(() =>
            message.channel.send("An error occured, maybe I don't have access to that channel?")
        ).then(function() {
            message.channel.send("👍")
        })
    }
}