const { prefix } = require('../config.json');
const discord = require ('discord.js')

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'info'],
	usage: '[command name]',
	cooldown: 2.5,
	execute(message, args, mention) {
		const data = [];
        const { commands } = message.client;

        if (!args.length) {
            var embed = new discord.MessageEmbed({
                title: 'Here\'s a list of all my commands:',
                description: "`" + commands.map(command => command.name).join('`, `') + "`"
            }).setFooter(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`)
            
            return message.author.send(embed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            message.reply('that\'s not a valid command!');
            return false
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 1} second(s)`);

        message.channel.send(data, { split: true });
	},
};