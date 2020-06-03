module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: false,
	guildOnly: false,
	cooldown: 5,
	aliases: ['moo', 'foo'],
	execute(message, args) {
		message.channel.send('Pong.');
	},
};