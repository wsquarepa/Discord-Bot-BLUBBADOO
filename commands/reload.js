const config = require("../config.json")
const admins = config["bot-admins"]

module.exports = {
	name: 'reload',
	description: 'Reloads a command, You must be a bot admin to execute this command.',
	args: true,
	aliases: ['update'],
	execute(message, args) {

        if (!admins.includes(message.author.id)) {
            return message.reply("Sorry, you can't execute that command.")
        }

		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`);
		} catch (error) {
			console.log(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};