const config = require("../config.json")
const admins = config["botAdmins"]
const discord = require('discord.js')

module.exports = {
	name: 'reload',
	description: 'Reloads a command, You must be a bot admin to execute this command.',
	args: false,
	usage:'[command name]',
	aliases: ['update'],
    category: "info",
    adminOnly: true,
	execute(message, args, mention) {
		if (!args.length) {
			message.channel.send("Are you sure you want to stop the process, <@" + message.author.id + ">? This will clear all cooldowns.")
			const collector = new discord.MessageCollector(message.channel, x => x.author.id == message.author.id, {time: 10000})
			collector.on('collect', (msg) => {
				collector.stop()
				if (msg.content.startsWith("y")) {
					message.channel.send("Process ending in 5 seconds...").then(() => {
						setTimeout(() => {
							process.exit()
						}, 5000);	
					})
				} else {
					message.channel.send("Process continuing.")
				}
			})
			return;
		}

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
			console.log("[SHARD/ERROR] " + error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};