//link: https://discord.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=2147483647
module.exports = {
	name: 'invite',
	description: 'Invite for the bot!',
	args: false,
    category: "info",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        message.client.guilds.cache.find(x => x.id == "712438988547555448")
            .channels.cache.find(x => x.id == "714151494491963473").createInvite({
                maxAge: 900
            }).then((invite) => {
                const inviteCode = invite.code
                message.channel.send("**Bot invite is here:** <https://discord.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=2147483647> \n" + 
                "**Server invite is here:** https://discord.gg/" + inviteCode + "\n" +
                "This message will try to **AUTO DESTRUCT** when the invite expires.").then(m => {
                    m.delete({timeout: invite.maxAge * 1000}).catch()
                })
            })
    }
}