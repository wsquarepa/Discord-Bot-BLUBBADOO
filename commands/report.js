const Discord = require("discord.js")
const webhookClient = new Discord.WebhookClient("720427166650728589", "4PVEXDDaz0MS-2uN7rucTK6UZl6xh0FgHqLoFXPm2_HJ6LNYDBBTDcTna2N8OYm1ZTmZ");
const guildData = require('../guildData.json')
const functions = require('../jsHelpers/functions')

module.exports = {
    name: 'report',
    description: 'Report a bug, or anything to the bot developers! Be descriptive and kind!',
    args: true,
    usage: '<message>',
    guildOnly: false,
    aliases: [],
    cooldown: 10,
    category: "info",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {
        if (args.join(" ").length < 10) {
            message.channel.send("Sorry, but reports require at least 10 characters. \n Please do not misuse this feature, because you can be banned from the bot.")
            return false
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('New report from ' + message.author.tag)
            .setDescription(args.join(" "))
            .setColor(functions.globalEmbedColor)
            .setFooter("User id: " + message.author.id)

        webhookClient.send({
            username: 'User Reports',
            embeds: [embed],
        });

        message.channel.send("Your report has been logged. \n For further assistance, join Blubbadoo Support Server! \n Invite links are provided with " + 
        (message.guild? guildData[message.guild.id].prefix:"==") + "invite.")
        
    }
}