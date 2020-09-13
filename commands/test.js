module.exports = {
    name: 'test',
	description: 'Error testing',
    args: false,
    usage: '[err]',
    guildOnly: false,
    aliases: [],
    cooldown: 0,
    levelRequirement: 0,
    category: "info",
    adminOnly: true,
	execute(message, args, mention) {
        if (!args.length) {
            args[0] = "Test Error"
        }
        throw args.join(" ")
    }
}