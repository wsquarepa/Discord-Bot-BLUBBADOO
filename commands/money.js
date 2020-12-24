const discord = require('discord.js')
const userData = require('../userData.json')

function convertHuman(number) {
    const stringList = number.toString().split("").reverse().join("").match(/.{1,3}/g).reverse()
    for (var i = 0; i < stringList.length; i++) {
        stringList[i] = stringList[i].split("").reverse().join("")
    }
    return stringList.join(" ")
}

module.exports = {
    name: 'money',
	description: '',
    args: false,
    usage: '',
    guildOnly: false,
    aliases:['bal', 'balance'],
    cooldown: 0.5,
    category: "economy",
    adminOnly: false,
	execute(message, args, mention, specialArgs) {
        
        if (mention) {
            if (mention.bot) {
                message.channel.send("Fortunately, bots obviously doesn't have money")
                return false;
            }

            if (!userData[mention.id]) {
                message.channel.send("That user doesn't have a bank account yet.")
                return false;
            }

            var cash = userData[mention.id].cash
            var bank = userData[mention.id].bank
            var gems = userData[mention.id].gems

            const cashDisplay = convertHuman(cash)
            const bankDisplay = convertHuman(bank)

            var embed = new discord.MessageEmbed()
                .setTitle(mention.username + "'s balance:")
                .setDescription("Cash: $" + cashDisplay + " \n Bank: $" + bankDisplay + "\n Gems: " + gems + "💎")
                .setColor("2f3237")
            message.channel.send(embed)
            return
        }

        var cash = userData[message.author.id].cash
        var bank = userData[message.author.id].bank
        var gems = userData[message.author.id].gems
        var bankLimit = userData[message.author.id].bankLimit
        var bankChart = ['|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|']

        const cashDisplay = convertHuman(cash)
        const bankDisplay = convertHuman(bank)
        const bankLimitDisplay = convertHuman(bankLimit)
    
        const loc = parseInt(10.0 * (bank / bankLimit) + 0.5)

        bankChart[loc] = "**|**"
        var embed = new discord.MessageEmbed()
                .setTitle("Your balance:")
                .addField("Cash", "$" + cashDisplay)
                .addField("Bank", "$" + bankDisplay + " / $" + bankLimitDisplay + " " + bankChart.join("") + " (" + (((bank / bankLimit) * 100).toFixed(2)) + "%)")
                .addField("Gems", gems + " 💎")
                .setColor("2f3237")
                .setFooter(userData[message.author.id].account.secured? "Account Locked." : "Account not Locked.")
                .setTimestamp(Date.now())
        message.channel.send(embed)
    }
}