var parcel = require('../package.json')
module.exports = {
	name: 'version',
	description: 'See the version of me!',
	args: false,
	guildOnly: false,
	cooldown: 5,
	aliases: ['v'],
    category: "info",
    adminOnly: false,
	execute(message, args, mention) {
		message.channel.send("Blubbadoo is on V" + parcel.version + "!");
	},
};