const guildData = require('../guildData.json')
const discord = require ('discord.js')
const categoriesDescriptionInfoThingyThatIsAHelperFileThatHelpsMeALot = require('../jsHelpers/categories')

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 2.5,
    category: "info",
    adminOnly: false,
	execute(message, args, mention) {
        const prefix = guildData[message.guild.id].prefix
		const data = [];
        const { commands } = message.client;

        if (!args.length) {
            var categories = []
            var totalCommandStuff = commands.map(command => command.name)

            for (var cmdName in totalCommandStuff) {
                cmdName = totalCommandStuff[cmdName]
                const command = commands.get(cmdName) || commands.find(c => c.aliases && c.aliases.includes(cmdName));
                if (!command.adminOnly && command.category != "" && !categories.includes(command.category)) {
                    categories.push(command.category)
                }
            }

            var embed = new discord.MessageEmbed({
                title: 'Here\'s a list of my categories:'
            }).setFooter(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command or \`${prefix}help [category name]\` to see the commands in that category!`)

            for (var i in categories) {
                var categoryDescription = categoriesDescriptionInfoThingyThatIsAHelperFileThatHelpsMeALot[categories[i]]
                if (categoryDescription == null) categoryDescription = categoriesDescriptionInfoThingyThatIsAHelperFileThatHelpsMeALot.default
                embed.addField(categories[i], categoryDescription.description)
            }

            message.channel.send(embed)
            return;
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            var categories = []
            var totalCommandStuff = commands.map(command => command.name)

            for (var cmdName in totalCommandStuff) {
                cmdName = totalCommandStuff[cmdName]
                const command = commands.get(cmdName) || commands.find(c => c.aliases && c.aliases.includes(cmdName));
                if (!command.adminOnly && command.category != "" && !categories.includes(command.category)) {
                    categories.push(command.category)
                }
            }

            if (!categories.includes(name)) {
                message.channel.send("That's not a valit command or a category, <@" + message.author.id + ">!")
                return false;
            }

            var commandsInCategory = totalCommandStuff.filter(x => commands.get(x).category == name)
            var embed = new discord.MessageEmbed({
                title: `Here's a list of all the commands in category "${name}":`,
                description: "`" + commandsInCategory.join("`, `") + "`"
            }).setFooter(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`)

            message.channel.send(embed)
            return;
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 1} second(s)`);

        message.channel.send(data, { split: true });
	},
};