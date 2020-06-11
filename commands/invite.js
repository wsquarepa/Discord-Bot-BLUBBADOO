//link: https://discordapp.com/oauth2/authorize?&client_id=716689798462439435&scope=bot&permissions=8
module.exports = {
	name: 'invite',
	description: 'Invite for the bot!',
	args: false,
    execute(message, args, mention) {
        message.client.guilds.cache.find(x => x.id == "712438988547555448")
            .channels.cache.find(x => x.id == "712439060723007548").createInvite({
                maxAge: 300
            }).then((invite) => {
                var inviteCode = invite.code
                message.channel.send("**Bot invite is here:** https://discordapp.com/oauth2/authorize?&client_id=716689798462439435&scope=bot&permissions=8 \n" + 
                "**Server invite is here:** https://discord.gg/" + inviteCode + "\n" +
                "This message will **AUTO DESTRUCT** when the invite expires.").then(m => {
                    m.delete({timeout: invite.maxAge * 1000}).catch()
                })
            })
    }
}