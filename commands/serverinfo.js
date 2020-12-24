const discord = require("discord.js")
const functions = require("../jsHelpers/functions")

function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};

module.exports = {
    name: 'serverinfo',
    description: 'Shows information about your server.',
    args: false,
    usage: '',
    guildOnly: true,
    aliases: ['si', 'serveri', 'sinfo'],
    cooldown: 5,
    levelRequirement: 0,
    category: "moderation",
    adminOnly: false,
    execute(message, args, mention, specialArgs) {

        let region = {
            "brazil": ":flag_br: Brazil",
            "eu-central": ":flag_eu: Central Europe",
            "singapore": ":flag_sg: Singapore",
            "us-central": ":flag_us: U.S. Central",
            "sydney": ":flag_au: Sydney",
            "us-east": ":flag_us: U.S. East",
            "us-south": ":flag_us: U.S. South",
            "us-west": ":flag_us: U.S. West",
            "eu-west": ":flag_eu: Western Europe",
            "vip-us-east": ":flag_us: VIP U.S. East",
            "london": ":flag_gb: London",
            "amsterdam": ":flag_nl: Amsterdam",
            "hongkong": ":flag_hk: Hong Kong",
            "russia": ":flag_ru: Russia",
            "southafrica": ":flag_za:  South Africa"
        };

        var embed = new discord.MessageEmbed()
        embed.setTitle("Server information:")
            .addField("Name", message.guild.name, true)
            .addField("ID", message.guild.id, true)
            .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
            .addField("Region", region[message.guild.region], true)
            // .addField("Channel Size (People able to see channel)", `
            // Total: ${message.guild.members.cache.size}
            // Humans: ${message.guild.members.cache.filter(member => !member.user.bot).size}
            // Bots: ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
            .addField("Channels", message.guild.channels.cache.size, true)
            .addField("Roles", message.guild.roles.cache.size, true)
            .addField("Verification Level", message.guild.verificationLevel, true)
            .addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
            .setThumbnail(message.guild.iconURL)
            .setColor(functions.globalEmbedColor)

        message.channel.send(embed)
    }
}