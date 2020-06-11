const Discord = require("discord.js")
const webhookClient = new Discord.WebhookClient("720427166650728589", "4PVEXDDaz0MS-2uN7rucTK6UZl6xh0FgHqLoFXPm2_HJ6LNYDBBTDcTna2N8OYm1ZTmZ");

module.exports = {
    name: 'report',
    description: 'Report a bug, or anything to wsquarepa! Be descriptive and kind!',
    args: true,
    usage: '<message>',
    guildOnly: false,
    aliases: [],
    cooldown: 10,
    execute(message, args, mention) {
        const embed = new Discord.MessageEmbed()
            .setTitle('New report from ' + message.author.tag + "!")
            .setDescription(args.join(" "))
            .setColor('#0000ff');

        webhookClient.send({
            username: 'Blubbadoo Reports',
            embeds: [embed],
        });

        message.channel.send("Your report has been logged. \n For further assistance, join Blubbadoo Support Server! \n Invite links are provided with ==invite.")
    }
}