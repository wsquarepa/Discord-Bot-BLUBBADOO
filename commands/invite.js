//link: https://discordapp.com/oauth2/authorize?&client_id=716689798462439435&scope=bot&permissions=8
module.exports = {
	name: 'invite',
	description: 'Invite for the bot!',
	args: false,
    execute(message, args, mention) {
        message.channel.send("https://discordapp.com/oauth2/authorize?&client_id=716689798462439435&scope=bot&permissions=8")
    }
}