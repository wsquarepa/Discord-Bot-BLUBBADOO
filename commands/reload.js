const config = require("../config.json")
const admins = config["botAdmins"]

module.exports = {
	name: 'reload',
	description: 'Reloads a command, You must be a bot admin to execute this command.',
	args: true,
	usage:'[command name]',
	aliases: ['update'],
    category: "info",
    adminOnly: true,
	execute(message, args, mention) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
			return false
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`).then((msg) => {
				message.delete().catch()
				msg.delete({timeout: 2500})
			});
		} catch (error) {
			console.log("[ERROR/SHARD] " + error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};